import { NotionAPI } from "notion-client"

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI({
    authToken: process.env.NOTION_TOKEN_V2,
  })
  const recordMap = await api.getPage(pageId)
  return recordMap
}
