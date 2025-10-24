import { useRouter } from "next/router"
import React, { useEffect, useMemo, useRef, useState } from "react"
import styled from "@emotion/styled"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { CONFIG } from "site.config"
import { filterPosts } from "./filterPosts"

type Props = {
  q: string
}

const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const posts = usePostsQuery()
  const [page, setPage] = useState(1)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const shouldScrollToTopRef = useRef(false)
  const isInitialRenderRef = useRef(true)

  const currentTag = `${router.query.tag || ""}` || undefined
  const currentCategory = `${router.query.category || ""}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ""}` || "desc"

  const filteredPosts = useMemo(
    () =>
      filterPosts({
        posts,
        q,
        tag: currentTag,
        category: currentCategory,
        order: currentOrder,
      }),
    [posts, q, currentTag, currentCategory, currentOrder]
  )

  const totalPageCount = Math.ceil(
    filteredPosts.length / CONFIG.blog.postsPerPage
  )
  const totalPages = totalPageCount > 0 ? totalPageCount : 1

  const pageStorageKey = router.isReady ? `feed-page:${router.asPath}` : null

  useEffect(() => {
    if (!pageStorageKey) return
    try {
      const storedValue = sessionStorage.getItem(pageStorageKey)
      if (!storedValue) return
      const parsed = Number(storedValue)
      if (Number.isNaN(parsed)) return
      const clamped = Math.min(Math.max(parsed, 1), totalPages)
      setPage(clamped)
    } catch {
      // ignore storage errors
    }
  }, [pageStorageKey, totalPages])

  useEffect(() => {
    if (!pageStorageKey) return
    try {
      sessionStorage.setItem(pageStorageKey, String(page))
    } catch {
      // ignore storage errors
    }
  }, [page, pageStorageKey])

  useEffect(() => {
    if (isInitialRenderRef.current) {
      return
    }
    setPage(1)
  }, [q, currentTag, currentCategory, currentOrder])

  useEffect(() => {
    setPage((prev) => {
      const clamped = Math.min(Math.max(prev, 1), totalPages)
      return clamped === prev ? prev : clamped
    })
  }, [totalPages])

  useEffect(() => {
    if (!shouldScrollToTopRef.current) return
    if (!topSentinelRef.current) return

    topSentinelRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
    shouldScrollToTopRef.current = false
  }, [page])

  useEffect(() => {
    isInitialRenderRef.current = false
  }, [])

  const goToPreviousPage = () => {
    if (page <= 1) return
    shouldScrollToTopRef.current = true
    setPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    if (page >= totalPages) return
    shouldScrollToTopRef.current = true
    setPage((prev) => Math.min(prev + 1, totalPages))
  }

  const startIndex = (page - 1) * CONFIG.blog.postsPerPage
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + CONFIG.blog.postsPerPage
  )

  const isNextDisabled =
    page * CONFIG.blog.postsPerPage >= filteredPosts.length

  return (
    <PostListWrapper>
      <div ref={topSentinelRef} />
      <div className="my-2">
        {!filteredPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">Nothing! 😺</p>
        )}
        {currentPosts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
      <PagerWrapper>
        <PagerButton
          type="button"
          onClick={goToPreviousPage}
          disabled={page === 1}
        >
          Previous
        </PagerButton>
        <span>
          {Math.min(page, totalPages)} / {filteredPosts.length ? totalPageCount : 0}
        </span>
        <PagerButton
          type="button"
          onClick={goToNextPage}
          disabled={isNextDisabled}
        >
          Next
        </PagerButton>
      </PagerWrapper>
    </PostListWrapper>
  )
}

export default PostList

const PostListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const PagerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`

const PagerButton = styled.button`
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray4};
  color: ${({ theme }) => theme.colors.gray11};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray5};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
