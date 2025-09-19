import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import Link from "next/link"

// 定义带有摇晃动画的样式
const ShakingEmoji = styled.span<{ isShaking: boolean }>`
  display: inline-block;
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 1rem;
  animation: ${({ isShaking }) => (isShaking ? "shake 0.5s ease-in-out" : "none")};

  @keyframes shake {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(10deg);
    }
    75% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`

// 定义页面整体样式
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.gray12};
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.gray10};
  }

  a {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.blue10};
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray4};
    transition: background-color 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray6};
    }
  }
`

const Custom404: React.FC = () => {
  // 控制摇晃状态
  const [isShaking, setIsShaking] = useState(false)

  // 每隔随机时间触发摇晃
  useEffect(() => {
    const triggerShake = () => {
      setIsShaking(true)
      // 动画持续 0.5 秒后停止
      setTimeout(() => setIsShaking(false), 500)
    }

    // 随机生成 3-5 秒的间隔
    const getRandomInterval = () => Math.random() * 2000 + 3000

    // 设置定时器触发摇晃
    const interval = setInterval(triggerShake, getRandomInterval())

    // 组件卸载时清除定时器
    return () => clearInterval(interval)
  }, [])

  return (
    <StyledWrapper>
      <ShakingEmoji isShaking={isShaking}>🤔</ShakingEmoji>
      <h1>404 - 页面未找到</h1>
      <p>抱歉，您访问的页面不存在！</p>
      <Link href="/">返回首页</Link>
    </StyledWrapper>
  )
}

export default Custom404