import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  const id = CONFIG.notionConfig.pageId as string
  if (!id) {
    throw new Error("`NOTION_PAGE_ID` is not set in site.config.js")
  }
  const api = new NotionAPI({
    apiBaseUrl: "https://physicalmouse.notion.site/api/v3",
    authToken: process.env.NOTION_TOKEN_V2,
  })
  const response = await api.getPage(id)
  const collection = Object.values(response.collection)[0]?.value
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[idToUuid(id)].value

  // Check Type
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  }

  const collectionView = Object.values(rawMetadata?.view_ids).map(
    (view_id) => response.collection_view[view_id]?.value
  )[0]
  const collectionData = await api.getCollectionData(
    collection.id,
    collectionView.id,
    collectionView.type
  )

  const pageIds = Object.keys(collectionData.recordMap.block)
  const data = []
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const properties = (await getPageProperties(id, block, schema)) || null
    // Add fullwidth, createdtime to properties
    properties.createdTime = new Date(
      block[id].value?.created_time
    ).toString()
    properties.fullWidth =
      (block[id].value?.format as any)?.page_full_width ?? false

    data.push(properties)
  }

  // Sort by date
  data.sort((a: any, b: any) => {
    const dateA: any = new Date(a?.date?.start_date || a.createdTime)
    const dateB: any = new Date(b?.date?.start_date || b.createdTime)
    return dateB - dateA
  })

  const posts = data as TPosts
  return posts
}
