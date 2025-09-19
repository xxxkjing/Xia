// src/routes/Detail/PostDetail/index.tsx
import React, { useEffect, useState } from "react"  // 导入 useState/useEffect 用于生成和渲染目录
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {}

type Heading = {
  id: string
  text: string
  level: number  // 1 for h1, 2 for h2, 3 for h3
}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()
  const [headings, setHeadings] = useState<Heading[]>([])  // 存储提取的目录项

  // 在组件挂载后，从 recordMap 中提取 h1/h2/h3 标题
  useEffect(() => {
    if (data?.recordMap) {
      const newHeadings: Heading[] = []
      Object.values(data.recordMap.block).forEach((block) => {
        const { value } = block
        if (value.type === 'header') {  // h1
          newHeadings.push({ id: value.id, text: value.properties.title[0][0], level: 1 })
        } else if (value.type === 'sub_header') {  // h2
          newHeadings.push({ id: value.id, text: value.properties.title[0][0], level: 2 })
        } else if (value.type === 'sub_sub_header') {  // h3
          newHeadings.push({ id: value.id, text: value.properties.title[0][0], level: 3 })
        }
      })
      setHeadings(newHeadings)
    }
  }, [data])

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined

  // 处理目录项点击，滚动到对应块
  const handleTocClick = (id: string) => {
    const element = document.querySelector(`[data-block-id="${id}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <StyledWrapper>
      <article>
        {category && (
          <div css={{ marginBottom: "0.5rem" }}>
            <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
              {category}
            </Category>
          </div>
        )}
        {data.type[0] === "Post" && <PostHeader data={data} />}
        <div>
          <NotionRenderer recordMap={data.recordMap} />
        </div>
        {headings.length > 0 && (  // 如果有标题，则渲染目录（固定在右侧）
          <TocWrapper>
            <div className="toc-title">目录</div>
            <ul>
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={`level-${heading.level}`}  // 根据 level 缩进
                  onClick={() => handleTocClick(heading.id)}
                >
                  {heading.text}
                </li>
              ))}
            </ul>
          </TocWrapper>
        )}
        {data.type[0] === "Post" && (
          <>
            <Footer />
            <CommentBox data={data} />
          </>
        )}
      </article>
    </StyledWrapper>
  )
}

export default PostDetail

const StyledWrapper = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 56rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  position: relative;  // 相对定位以容纳固定目录
  > article {
    margin: 0 auto;
    max-width: 42rem;
  }
`

// 目录样式：固定在右侧，不随滚动滑动，遵从项目 gray 色调
const TocWrapper = styled.aside`
  position: fixed;  // 固定位置，不随滚动移动
  top: 4rem;  // 避开头部的空间
  right: 1rem;  // 最右侧布局
  width: 200px;  // 固定宽度
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray2};  // 项目 gray 背景
  border-radius: 1rem;  // 项目圆角样式
  font-size: 0.875rem;  // 项目小字体
  max-height: calc(100vh - 6rem);  // 适应视口高度
  overflow-y: auto;  // 如果目录过长，可滚动
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  // 轻微阴影，匹配项目
  .toc-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.gray12};  // 项目标题色
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    cursor: pointer;
    margin-bottom: 0.25rem;
    color: ${({ theme }) => theme.colors.gray10};  // 项目文本色
    &:hover {
      color: ${({ theme }) => theme.colors.gray12};  // 悬停高亮
    }
    &.level-2 { padding-left: 1rem; }  // h2 缩进
    &.level-3 { padding-left: 2rem; }  // h3 缩进
  }
  @media (max-width: 1024px) {  // 中屏：缩小宽度
    width: 150px;
    right: 0.5rem;
  }
  @media (max-width: 768px) {  // 移动端：移除固定，改为相对定位在上方，避免遮挡
    position: relative;
    top: 0;
    right: 0;
    width: 100%;
    margin: 1rem auto;
    max-height: none;
  }
`