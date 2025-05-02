import { type NextRequest, NextResponse } from "next/server"
import { ImageAnnotatorClient } from "@google-cloud/vision"
import { PDFDocument } from "pdf-lib"
import { solveMathProblem } from "@/lib/gemini-api"

// Initialize the Vision API client with credentials from environment variable
let visionClient: ImageAnnotatorClient | null = null

try {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}")
  visionClient = new ImageAnnotatorClient({ credentials })
} catch (error) {
  console.error("Error initializing Vision API client:", error)
  // We'll handle this case in the request handler
}

export async function POST(request: NextRequest) {
  try {
    // Check if Vision API client was initialized successfully
    if (!visionClient) {
      return NextResponse.json(
        {
          error: "OCR service is not available. Please use text input instead.",
        },
        { status: 503 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 5MB.",
        },
        { status: 400 },
      )
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Please upload a JPG, PNG, or PDF file.",
        },
        { status: 400 },
      )
    }

    // Get file buffer
    const buffer = await file.arrayBuffer()
    const fileBytes = new Uint8Array(buffer)

    // Extract text based on file type
    let extractedText = ""

    try {
      if (file.type === "application/pdf") {
        // Handle PDF files
        extractedText = await extractTextFromPDF(fileBytes, visionClient)
      } else {
        // Handle image files
        extractedText = await extractTextFromImage(fileBytes, visionClient)
      }

      if (!extractedText || extractedText.trim() === "") {
        return NextResponse.json(
          {
            error:
              "Could not extract text from the file. Please ensure the image contains clear text or try using text input instead.",
          },
          { status: 400 },
        )
      }

      // Solve the extracted math problem using Gemini API
      try {
        const solution = await solveMathProblem(extractedText)

        return NextResponse.json({
          problem: extractedText,
          solution,
        })
      } catch (aiError) {
        console.error("Error in AI processing:", aiError)
        return NextResponse.json(
          {
            error: "Failed to solve the problem. Please try again or use text input instead.",
            extractedText: extractedText, // Return the extracted text so the user can try manual input
          },
          { status: 500 },
        )
      }
    } catch (error) {
      console.error("Error in OCR processing:", error)
      return NextResponse.json(
        {
          error: "Failed to process the file. Please try again with a clearer image or use text input instead.",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing OCR request:", error)
    return NextResponse.json(
      {
        error: "Failed to process the request. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function extractTextFromImage(imageBytes: Uint8Array, client: ImageAnnotatorClient): Promise<string> {
  try {
    // Create a proper request object for the Vision API
    const request = {
      image: {
        content: Buffer.from(imageBytes.buffer).toString('base64')
      }
    }
    
    const [result] = await client.textDetection(request)
    const detections = result.textAnnotations

    if (detections && detections.length > 0) {
      // The first annotation contains the entire text
      return detections[0].description || ""
    }

    return ""
  } catch (error) {
    console.error("Error in image text extraction:", error)
    throw new Error(`Image text extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function extractTextFromPDF(pdfBytes: Uint8Array, client: ImageAnnotatorClient): Promise<string> {
  try {
    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const numPages = pdfDoc.getPageCount()

    // For PDFs, we'll extract text from each page as an image
    // This is a simplified approach - in production, you might want to use a PDF text extraction library
    let allText = ""

    // For simplicity, we'll just process the first page
    // In a real app, you might want to process all pages or let the user select a page
    if (numPages > 0) {
      const page = pdfDoc.getPages()[0]

      // Create a new PDF with just this page
      const singlePagePdf = await PDFDocument.create()
      const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [0])
      singlePagePdf.addPage(copiedPage)

      // Convert to bytes and then use Vision API
      const singlePageBytes = await singlePagePdf.save()
      // Create a proper request object for the Vision API
      const request = {
        image: {
          content: Buffer.from(singlePageBytes).toString('base64')
        }
      }
      // Use Vision API to extract text from the PDF
      const [result] = await client.documentTextDetection(request)
      const fullTextAnnotation = result.fullTextAnnotation

      if (fullTextAnnotation) {
        allText = fullTextAnnotation.text || ""
      }
    }

    return allText
  } catch (error) {
    console.error("Error extracting text from PDF:", error)
    throw new Error(`PDF text extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
