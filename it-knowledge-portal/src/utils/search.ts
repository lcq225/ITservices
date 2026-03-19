import request from '../api/request'

const ES_API_URL = import.meta.env.VITE_ELASTICSEARCH_URL || 'http://localhost:9200'

export interface SearchResult<T> {
  hits: {
    total: number
    hits: Array<{
      _source: T
      _score: number
    }>
  }
}

class SearchService {
  private enabled = false

  async init() {
    try {
      await request.get(`${ES_API_URL}/_cluster/health`, {
        timeout: 3000
      })
      this.enabled = true
      console.log('Elasticsearch connected')
    } catch {
      console.log('Elasticsearch not available, using database search')
      this.enabled = false
    }
  }

  async searchArticles(keyword: string, page = 1, pageSize = 10) {
    if (!this.enabled) {
      return null
    }

    try {
      const response = await request.post<SearchResult<any>>(
        `${ES_API_URL}/articles/_search`,
        {
          from: (page - 1) * pageSize,
          size: pageSize,
          query: {
            multi_match: {
              query: keyword,
              fields: ['title^3', 'content^2', 'tags']
            }
          }
        }
      )
      return response
    } catch (error) {
      console.error('Elasticsearch search failed:', error)
      return null
    }
  }

  async searchQuestions(keyword: string, page = 1, pageSize = 10) {
    if (!this.enabled) {
      return null
    }

    try {
      const response = await request.post<SearchResult<any>>(
        `${ES_API_URL}/questions/_search`,
        {
          from: (page - 1) * pageSize,
          size: pageSize,
          query: {
            multi_match: {
              query: keyword,
              fields: ['title^3', 'content^2', 'tags']
            }
          }
        }
      )
      return response
    } catch (error) {
      console.error('Elasticsearch search failed:', error)
      return null
    }
  }

  async indexArticle(article: {
    id: number
    title: string
    content: string
    tags: string[]
    type: string
  }) {
    if (!this.enabled) return

    try {
      await request.put(
        `${ES_API_URL}/articles/_doc/${article.id}`,
        article
      )
    } catch (error) {
      console.error('Failed to index article:', error)
    }
  }

  async indexQuestion(question: {
    id: number
    title: string
    content: string
    tags: string[]
  }) {
    if (!this.enabled) return

    try {
      await request.put(
        `${ES_API_URL}/questions/_doc/${question.id}`,
        question
      )
    } catch (error) {
      console.error('Failed to index question:', error)
    }
  }

  async deleteArticle(id: number) {
    if (!this.enabled) return

    try {
      await request.delete(`${ES_API_URL}/articles/_doc/${id}`)
    } catch (error) {
      console.error('Failed to delete article from index:', error)
    }
  }

  async deleteQuestion(id: number) {
    if (!this.enabled) return

    try {
      await request.delete(`${ES_API_URL}/questions/_doc/${id}`)
    } catch (error) {
      console.error('Failed to delete question from index:', error)
    }
  }
}

export const searchService = new SearchService()
