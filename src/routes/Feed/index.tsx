import { useState } from "react"
import SearchInput from "./SearchInput"
import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import styled from "@emotion/styled"
import TagList from "./TagList"
import MobileProfileCard from "./MobileProfileCard"
import ProfileCard from "./ProfileCard"
import ServiceCard from "./ServiceCard"
import ContactCard from "./ContactCard"
import PostList from "./PostList"
import PinnedPosts from "./PostList/PinnedPosts"

// 常量未变
const HEADER_HEIGHT = 73

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")

  return (
    <StyledWrapper>
      {/* 重点改动 (1/2): 移除了此处的行内 css 属性 */}
      <div className="lt">
        <TagList />
      </div>

      <div className="mid">
        <MobileProfileCard />
        <PinnedPosts q={q} />
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tags">
          <TagList />
        </div>
        <FeedHeader />
        <PostList q={q} />
        <div className="footer">
          <Footer />
        </div>
      </div>

      {/* 重点改动 (2/2): 移除了此处的行内 css 属性 */}
      <div className="rt">
        <ProfileCard />
        <ServiceCard />
        <ContactCard />
        <div className="footer">
          <Footer />
        </div>
      </div>
    </StyledWrapper>
  )
}

export default Feed

// **重点改动**: 整个 StyledWrapper 的 CSS 定义已被替换为优化后的版本
const StyledWrapper = styled.div`
  grid-template-columns: repeat(12, minmax(0, 1fr));
  padding: 2rem 0;
  display: grid;
  gap: 1.5rem;
  
  /* **重点**：将 grid 容器的高度设置为视口减去头部高度，使主页面不再滚动。 */
  height: calc(100vh - ${HEADER_HEIGHT}px);

  @media (max-width: 768px) {
    display: block;
    /* **重点**：在移动端恢复正常文档流高度，允许页面滚动。 */
    height: auto;
    padding: 0.5rem 0;
  }

  /* **重点**：为所有列设置 overflow，让它们各自处理内部滚动。 */
  > .lt,
  > .rt,
  > .mid {
    overflow-y: auto;
  }

  /* **重点**：统一处理左右两栏，移除不再需要的 sticky 定位，并隐藏滚动条。 */
  > .lt,
  > .rt {
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  > .lt {
    display: none;
    grid-column: span 2 / span 2;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  > .mid {
    grid-column: span 12 / span 12;

    @media (min-width: 1024px) {
      grid-column: span 7 / span 7;
    }

    > .tags {
      display: block;

      @media (min-width: 1024px) {
        display: none;
      }
    }

    > .footer {
      padding-bottom: 2rem;
      @media (min-width: 1024px) {
        display: none;
      }
    }
  }

  > .rt {
    display: none;
    grid-column: span 3 / span 3;

    @media (min-width: 1024px) {
      display: block;
    }

    .footer {
      padding-top: 1rem;
    }
  }
`
