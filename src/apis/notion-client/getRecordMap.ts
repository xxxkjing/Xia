import { NotionAPI } from "notion-client"

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI({
    apiBaseUrl: "https://physicalmouse.notion.site/api/v3",
    authToken: process.env.NOTION_TOKEN_V2,
  })
  const recordMap = await api.getPage(pageId)
  return recordMap
}
