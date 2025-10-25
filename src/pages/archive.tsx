import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { NextPageWithLayout, TPosts } from "../types"
import MetaConfig from "src/components/MetaConfig"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"
import { formatDate } from "src/libs/utils"
import Link from "next/link"
import { GetStaticProps } from "next"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { getPosts } from "src/apis"
import { filterPosts } from "src/libs/utils/notion"
import { queryKey } from "src/constants/queryKey"

type Props = {}

const ArchivePage: NextPageWithLayout<Props> = () => {
  const posts = usePostsQuery()
  const tags = useTagsQuery()
  const categories = useCategoriesQuery()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!posts || posts.length === 0) {
    return <div>暂无文章数据，请检查 Notion 配置。</div>
  }

  const postsByYear = posts.reduce((acc: Record<string, any[]>, post) => {
    const year = new Date(post.date.start_date || post.createdTime).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {})

  const meta = {
    title: `${CONFIG.blog.title} - 归档`,
    description: "文章归档",
    type: "website",
    url: `${CONFIG.link}/archive`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <StyledWrapper className={isVisible ? "animate-fade-in" : ""}>
        <h1 className="animate-slide-in-right">归档</h1>
        <section className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <p>所有文章：{posts.length}</p>
          <div className="button-list">
            {Object.entries(tags).map(([tag, count], index) => (
              <ButtonItem 
                key={tag} 
                className="animate-scale-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                {tag}: {count}
              </ButtonItem>
            ))}
          </div>
          <div className="button-list">
            {Object.entries(categories).map(([category, count], index) => (
              <ButtonItem 
                key={category} 
                className="animate-scale-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                {category}: {count}
              </ButtonItem>
            ))}
          </div>
        </section>
        <section className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <TimelineWrapper>
            {Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a)).map((year, yearIndex) => (
              <YearSection 
                key={year}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.6 + yearIndex * 0.1}s` }}
              >
                <YearLabel>{year}</YearLabel>
                <TimelineLine />
                <PostList>
                  {postsByYear[year].map((post, index) => (
                    <PostItem 
                      key={post.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${0.7 + yearIndex * 0.1 + index * 0.05}s` }}
                    >
                      <PostDate>{formatDate(post.date.start_date || post.createdTime, CONFIG.lang)}</PostDate>
                      <PostTitle>
                        <Link href={`/${post.slug}`}>{post.title}</Link>
                      </PostTitle>
                    </PostItem>
                  ))}
                </PostList>
              </YearSection>
            ))}
          </TimelineWrapper>
        </section>
      </StyledWrapper>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()
  const posts: TPosts = filterPosts(await getPosts())

  await queryClient.prefetchQuery(queryKey.posts(), () => posts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

export default ArchivePage

const StyledWrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0;
  
  h1, h2, h3 {
    color: ${({ theme }) => theme.colors.gray12};
  }
  p {
    color: ${({ theme }) => theme.colors.gray10};
  }
  a {
    color: ${({ theme }) => theme.colors.gray10};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      text-decoration: underline;
      color: ${({ theme }) => theme.colors.blue10};
    }
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
    color: ${({ theme }) => theme.colors.gray10};
  }
  .button-list {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 1rem;
    justify-content: flex-start;
    align-items: center;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const TimelineWrapper = styled.div`
  position: relative;
  padding-left: 3.5rem;
  min-height: 100px;
`

const YearSection = styled.div`
  position: relative;
  margin-bottom: 2rem;
  opacity: 0;
`

const YearLabel = styled.h3`
  position: absolute;
  left: -3rem;
  top: 0.25rem;
  color: ${({ theme }) => theme.colors.gray12};
  font-size: 1.25rem;
  background-color: ${({ theme }) => theme.colors.gray2};
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`

const TimelineLine = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 1.25rem;
  bottom: 0;
  width: 2px;
  background-color: ${({ theme }) => theme.colors.gray6};
  transition: background-color 0.3s ease;
`

const PostList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: 0.5rem;
`

const PostItem = styled.li`
  position: relative;
  margin-bottom: 1rem;
  padding-left: 1rem;
  list-style: none;
  opacity: 0;
  transition: transform 0.3s ease;
  
  &::before {
    display: none;
  }
  
  &:hover {
    transform: translateX(5px);
  }
`

const PostDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray10};
  margin-right: 0.5rem;
`

const PostTitle = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray12};
`

const ButtonItem = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.colors.gray4};
  color: ${({ theme }) => theme.colors.gray10};
  font-size: 0.875rem;
  cursor: default;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`
