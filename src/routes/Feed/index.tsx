import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
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

const HEADER_HEIGHT = 73

type Props = {}

const Feed: React.FC<Props> = () => {
  const router = useRouter()
  const [q, setQ] = useState("")
  const midColumnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!router.isReady) return
    const scrollElement = midColumnRef.current
    if (!scrollElement) return

    const storageKey = `feed-scroll:${router.asPath}`

    let initialTop = 0
    try {
      const savedValue = sessionStorage.getItem(storageKey)
      if (savedValue) {
        const parsed = Number(savedValue)
        if (!Number.isNaN(parsed)) {
          initialTop = parsed
        }
      }
    } catch {
      // ignore storage errors
    }

    scrollElement.scrollTop = initialTop

    const handleScroll = () => {
      try {
        sessionStorage.setItem(storageKey, String(scrollElement.scrollTop))
      } catch {
        // ignore storage errors
      }
    }

    scrollElement.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
      try {
        sessionStorage.setItem(storageKey, String(scrollElement.scrollTop))
      } catch {
        // ignore storage errors
      }
    }
  }, [router.asPath, router.isReady])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQ(event.target.value)
    if (midColumnRef.current) {
      midColumnRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <StyledWrapper>
      <div className="lt">
        <TagList />
      </div>

      <div className="mid" ref={midColumnRef}>
        <MobileProfileCard />
        <PinnedPosts q={q} />
        <SearchInput value={q} onChange={handleSearchChange} />
        <div className="tags">
          <TagList />
        </div>
        <FeedHeader />
        <PostList q={q} />
        <div className="footer">
          <Footer />
        </div>
      </div>

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

const StyledWrapper = styled.div`
  grid-template-columns: repeat(12, minmax(0, 1fr));
  padding: 2rem 0;
  display: grid;
  gap: 1.5rem;

  height: calc(100vh - ${HEADER_HEIGHT}px);

  @media (max-width: 768px) {
    display: block;
    height: auto;
    padding: 0.5rem 0;
  }

  > .lt,
  > .rt,
  > .mid {
    overflow-y: auto;
  }

  > .lt,
  > .rt,
  > .mid {
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
