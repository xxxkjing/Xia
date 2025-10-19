import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { CONFIG } from "site.config"

type Props = {
  q: string
}

const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery()
  const [filteredPosts, setFilteredPosts] = useState(data)
  const [page, setPage] = useState(1)

  const currentTag = `${router.query.tag || ``}` || undefined
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ``}` || "desc"

  useEffect(() => {
    setFilteredPosts(() => {
      let newFilteredPosts = data
      // keyword
      newFilteredPosts = newFilteredPosts.filter((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : ""
        const searchContent = post.title + post.summary + tagContent
        return searchContent.toLowerCase().includes(q.toLowerCase())
      })

      // tag
      if (currentTag) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) => post && post.tags && post.tags.includes(currentTag)
        )
      }

      // category
      if (currentCategory !== DEFAULT_CATEGORY) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) =>
            post && post.category && post.category.includes(currentCategory)
        )
      }
      // order
      if (currentOrder !== "desc") {
        newFilteredPosts = newFilteredPosts.reverse()
      }

      return newFilteredPosts
    })
  }, [q, currentTag, currentCategory, currentOrder, setFilteredPosts, data])

  return (
    <>
      <div className="my-2">
        {!filteredPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">Nothing! 😺</p>
        )}
        {filteredPosts
          .slice(
            (page - 1) * CONFIG.blog.postsPerPage,
            page * CONFIG.blog.postsPerPage
          )
          .map((post) => (
            <PostCard key={post.id} data={post} />
          ))}
      </div>
      <PagerWrapper>
        <PagerButton onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </PagerButton>
        <span>
          {page} / {Math.ceil(filteredPosts.length / CONFIG.blog.postsPerPage)}
        </span>
        <PagerButton
          onClick={() => setPage(page + 1)}
          disabled={page * CONFIG.blog.postsPerPage >= filteredPosts.length}
        >
          Next
        </PagerButton>
      </PagerWrapper>
      </>
      )
      }
      
      export default PostList
      
      const PagerWrapper = styled.div`
        display: flex;
        justify-content: space-between;
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
