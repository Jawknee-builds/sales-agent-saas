import * as cheerio from 'cheerio'

export interface SearchResult {
    title: string
    link: string
    snippet: string
}

export async function searchGoogle(query: string): Promise<SearchResult[]> {
    try {
        const encodedQuery = encodeURIComponent(query)
        const url = `https://www.google.com/search?q=${encodedQuery}&num=10&hl=en`

        // Random User Agent to avoid immediate blocking
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

        const response = await fetch(url, {
            headers: {
                'User-Agent': userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        })

        if (!response.ok) {
            console.error('Search failed:', response.status, response.statusText)
            return []
        }

        const html = await response.text()
        const $ = cheerio.load(html)
        const results: SearchResult[] = []

        // Parse standard Google results (update selectors as Google changes them)
        // Usually results are in 'div.g'
        $('div.g').each((i, el) => {
            const titleEl = $(el).find('h3')
            const linkEl = $(el).find('a')
            const snippetEl = $(el).find('div[style*="-webkit-line-clamp"]') // This selector is tricky and changes often

            const title = titleEl.text()
            const link = linkEl.attr('href')

            // Fallback snippet extraction
            let snippet = snippetEl.text()
            if (!snippet) {
                snippet = $(el).text().substring(0, 150) + "..."
            }

            if (title && link && link.startsWith('http')) {
                results.push({
                    title,
                    link,
                    snippet
                })
            }
        })

        return results
    } catch (error) {
        console.error('Error scraping google:', error)
        return []
    }
}
