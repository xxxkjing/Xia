// src/pages/archive.tsx（完整代码，移除列表默认样式）
import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { NextPageWithLayout, TPosts } from "../types"  // 导入类型
import MetaConfig from "src/components/MetaConfig"
import usePostsQuery from "src/hooks/usePostsQuery"  // 默认导入 usePostsQuery
import { useTagsQuery } from "src/hooks/useTagsQuery"  // 命名导入 useTagsQuery
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"  // 命名导入 useCategoriesQuery
import { formatDate } from "src/libs/utils"
import Link from "next/link"
import { GetStaticProps } from "next"  // 导入 GetStaticProps
import { dehydrate, QueryClient } from "@tanstack/react-query"  // 导入 react-query 工具
import { getPosts } from "src/apis"  // 导入 getPosts API
import { filterPosts } from "src/libs/utils/notion"  // 导入 filterPosts
import { queryKey } from "src/constants/queryKey"  // 导入 queryKey

type Props = {}

const ArchivePage: NextPageWithLayout<Props> = () => {
  const posts = usePostsQuery()  // 获取所有文章
  const tags = useTagsQuery()  // 获取标签统计
  const categories = useCategoriesQuery()  // 获取类别统计

  // 如果 posts 为空，显示加载或错误提示（调试用）
  if (!posts || posts.length === 0) {
    return <div>暂无文章数据，请检查 Notion 配置。</div>
  }

  // 按年份分组文章时间线
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
      <StyledWrapper>
        <h1>归档</h1>
        <section>
          <p>所有文章：{posts.length}</p>  {/* 显示总文章数 */}
          <h3>标签</h3>
          <div className="button-list">  {/* 横向按钮列表，不换行 */}
            {Object.entries(tags).map(([tag, count]) => (
              <ButtonItem key={tag}>{tag}: {count}</ButtonItem>  // 每个标签的文章数作为按钮
            ))}
          </div>
          <h3>类别</h3>
          <div className="button-list">  {/* 横向按钮列表，不换行 */}
            {Object.entries(categories).map(([category, count]) => (
              <ButtonItem key={category}>{category}: {count}</ButtonItem>  // 每个类别的文章数作为按钮
            ))}
          </div>
        </section>
        <section>
          <h2>时间线</h2>
          <TimelineWrapper>  {/* 时间线容器 */}
            {Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a)).map((year) => (
              <YearSection key={year}>
                <YearLabel>{year}</YearLabel>  {/* 左侧年份标签 */}
                <TimelineLine />  {/* 垂直连接线 */}
                <PostList>
                  {postsByYear[year].map((post, index) => (
                    <PostItem key={post.id}>
                      <PostDate>{formatDate(post.date.start_date || post.createdTime, CONFIG.lang)}</PostDate>  {/* 日期 */}
                      <PostTitle>
                        <Link href={`/${post.slug}`}>{post.title}</Link>  {/* 文章标题链接 */}
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

// 添加 getStaticProps 以预取数据，确保 SSR 时数据可用
export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()  // 创建 queryClient 实例
  const posts: TPosts = filterPosts(await getPosts())  // 获取并过滤帖子

  // 预取 posts 数据
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),  // 脱水状态传递给客户端
    },
    revalidate: CONFIG.revalidateTime,  // ISR 重新验证时间
  }
}

export default ArchivePage

// 精简样式，修复错位并调整链接颜色
const StyledWrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  h1, h2, h3 {
    color: ${({ theme }) => theme.colors.gray12};
  }
  p {
    color: ${({ theme }) => theme.colors.gray10};
  }
  a {
    color: ${({ theme }) => theme.colors.gray10};  // 将链接颜色改为灰色（gray10）
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  ul {
    list-style: none;  // 移除所有ul的默认样式
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;  // 移除所有li的默认样式
    color: ${({ theme }) => theme.colors.gray10};
  }
  .button-list {  // 优化按钮列表，确保横向排列且居中对齐
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 1rem;
    justify-content: flex-start;  // 左对齐
    align-items: center;  // 垂直居中
    scrollbar-width: none;  // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

// 时间线样式，优化对齐，参考图片布局
const TimelineWrapper = styled.div`
  position: relative;
  padding-left: 3.5rem;  // 增加左侧空间，确保年份标签与点对齐
  min-height: 100px;  // 确保容器有足够高度
`

const YearSection = styled.div`
  position: relative;
  margin-bottom: 2rem;  // 增加年份间距
`

const YearLabel = styled.h3`
  position: absolute;
  left: -3rem;  // 精确调整年份左侧位置，与第一个点对齐
  top: 0.25rem;  // 微调年份标签位置，使其与第一个事件点对齐
  color: ${({ theme }) => theme.colors.gray12};
  font-size: 1.25rem;
  background-color: ${({ theme }) => theme.colors.gray2};
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
`

const TimelineLine = styled.div`
  position: absolute;
  left: 0.75rem;  // 调整线条位置，与点对齐
  top: 1.25rem;  // 调整起始位置，从第一个事件点下方开始
  bottom: 0;
  width: 2px;
  background-color: ${({ theme }) => theme.colors.gray6};
`

const PostList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: 0.5rem;  // 微调内容与线的距离
`

const PostItem = styled.li`
  position: relative;
  margin-bottom: 1rem;  // 增加事件间距
  padding-left: 1rem;  // 内容向右偏移
  list-style: none;
  
  /* 移除小圆点 */
  &::before {
    display: none;  // 隐藏小圆点
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

// 按钮样式，参考之前分类标签块，横向排列、不换行
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
`
