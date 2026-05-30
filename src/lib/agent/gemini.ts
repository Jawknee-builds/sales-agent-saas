import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateEmailWithGemini(
    lead: { name: string; company: string; recon?: string },
    context?: string
) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
    You are an expert sales development representative (SDR).
    
    CONTEXT:
    ${context || 'No specific product context provided. Assume we are selling high-end web development services.'}

    LEAD INFO:
    Name: ${lead.name}
    Company: ${lead.company}
    Recon Notes: ${lead.recon || 'None'}

    TASK:
    Write a short, punchy, personalized cold email to this lead.
    - Subject line should be casual (lowercase).
    - Opening line must reference the Recon Notes if available.
    - Pitch the value from CONTEXT.
    - End with a low-friction Call to Action (CTA).
    - Do not use placeholders like [Your Name].
  `

    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
}

export async function generateSearchQueries(userPrompt: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
    User Request: "${userPrompt}"
    
    Generate 3 distinct Google Search queries to find leads matching this request.
    Focus on finding "People" profiles, typically on LinkedIn or About Us pages.
    Use operators like site:linkedin.com/in/ or "Founder" "City".
    
    Return ONLY a JSON array of strings. Example: ["site:linkedin.com/in/ 'software engineer' 'sf'", "intitle:founder 'ai startup'"]
  `

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean up code blocks if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()

    try {
        return JSON.parse(jsonStr) as string[]
    } catch (e) {
        return [userPrompt + " site:linkedin.com/in/"]
    }
}
