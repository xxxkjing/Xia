import React, { useEffect, useState } from "react"
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
  level: number
}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // 检测是否为移动设备
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    if (data?.recordMap) {
      const newHeadings: Heading[] = []
      Object.values(data.recordMap.block).forEach((block) => {
        const { value } = block
        const titleText = value?.properties?.title?.[0]?.[0]
        
        if (titleText) {
          if (value.type === 'header') {
            newHeadings.push({ id: value.id, text: titleText, level: 1 })
          } else if (value.type === 'sub_header') {
            newHeadings.push({ id: value.id, text: titleText, level: 2 })
          } else if (value.type === 'sub_sub_header') {
            newHeadings.push({ id: value.id, text: titleText, level: 3 })
          }
        }
      })
      setHeadings(newHeadings)
    }
    
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [data])

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined

  const handleTocClick = (id: string) => {
    const element = document.querySelector(`[data-block-id="${id}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <StyledWrapper className={isVisible ? "animate-fade-in" : ""}>
      <article>
        {category && (
          <div css={{ marginBottom: "0.5rem" }} className="animate-fade-in-up">
            <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
              {category}
            </Category>
          </div>
        )}
        
        {/* 移动端目录显示在文章头部 */}
        {isMobile && headings.length > 0 && (
          <MobileTocWrapper className="animate-fade-in-up">
            <div className="toc-title">📑 文章目录</div>
            <div className="toc-content">
              {headings.map((heading, index) => (
                <div
                  key={heading.id}
                  className={`toc-item level-${heading.level}`}
                  onClick={() => handleTocClick(heading.id)}
                >
                  {heading.text}
                </div>
              ))}
            </div>
          </MobileTocWrapper>
        )}
        
        {data.type[0] === "Post" && (
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <PostHeader data={data} />
          </div>
        )}
        
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <NotionRenderer recordMap={data.recordMap} />
        </div>
        
        {/* 桌面端目录显示在右侧 */}
        {!isMobile && headings.length > 0 && (
          <TocWrapper className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="toc-title">目录</div>
            <ul>
              {headings.map((heading, index) => (
                <li
                  key={heading.id}
                  className={`level-${heading.level} animate-fade-in-up`}
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
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
            <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <Footer />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <CommentBox data={data} />
            </div>
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
  position: relative;
  opacity: 0;
  box-sizing: border-box;
  
  /* 移动端修复 */
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0.5rem;
    width: calc(100vw - 1rem);
    max-width: none;
    border-radius: 1rem;
  }
  
  > article {
    margin: 0 auto;
    max-width: 42rem;
    width: 100%;
    
    /* 移动端修复 */
    @media (max-width: 768px) {
      max-width: 100%;
      padding: 0;
    }
  }
`

// 桌面端目录样式
const TocWrapper = styled.aside`
  position: fixed;
  top: 4rem;
  right: 1rem;
  width: 200px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray2};
  border-radius: 1rem;
  font-size: 0.875rem;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: transform 0.3s ease;
  box-sizing: border-box;
  z-index: 100;
  
  /* 移动端隐藏桌面目录 */
  @media (max-width: 768px) {
    display: none;
  }
  
  @media (max-width: 1024px) {
    width: 150px;
    right: 0.5rem;
  }
  
  &:hover {
    transform: translateX(-5px);
  }
  
  .toc-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.gray12};
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    cursor: pointer;
    margin-bottom: 0.25rem;
    color: ${({ theme }) => theme.colors.gray10};
    opacity: 0;
    transition: color 0.3s ease, transform 0.2s ease;
    word-break: break-word;
    
    &:hover {
      color: ${({ theme }) => theme.colors.gray12};
      transform: translateX(3px);
    }
    
    &.level-2 { 
      padding-left: 1rem;
    }
    
    &.level-3 { 
      padding-left: 2rem;
    }
  }
`

// 移动端目录样式
const MobileTocWrapper = styled.div`
  display: none;
  margin-bottom: 1.5rem;
  background-color: ${({ theme }) => theme.colors.gray3};
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* 只在移动端显示 */
  @media (max-width: 768px) {
    display: block;
  }
  
  .toc-title {
    font-weight: bold;
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    
    &::before {
      content: "📑";
      margin-right: 0.5rem;
    }
  }
  
  .toc-content {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .toc-item {
    cursor: pointer;
    padding: 0.5rem 0;
    color: ${({ theme }) => theme.colors.gray11};
    transition: color 0.2s ease, background-color 0.2s ease;
    border-radius: 0.25rem;
    padding-left: 0.5rem;
    
    &:hover {
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray4};
    }
    
    &.level-2 {
      padding-left: 1.5rem;
      font-size: 0.95rem;
    }
    
    &.level-3 {
      padding-left: 2.5rem;
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.gray9};
    }
  }
`