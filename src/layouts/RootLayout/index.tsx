import React, { ReactNode, useEffect, useState } from "react"  // 导入 useState/useEffect 用于控制动画类名
import { ThemeProvider } from "./ThemeProvider"
import useScheme from "src/hooks/useScheme"
import Header from "./Header"
import styled from "@emotion/styled"
import Scripts from "src/layouts/RootLayout/Scripts"
import useGtagEffect from "./useGtagEffect"
import Prism from "prismjs/prism"
import 'prismjs/components/prism-markup-templating.js'
import 'prismjs/components/prism-markup.js'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-c.js'
import 'prismjs/components/prism-cpp.js'
import 'prismjs/components/prism-csharp.js'
import 'prismjs/components/prism-docker.js'
import 'prismjs/components/prism-java.js'
import 'prismjs/components/prism-js-templates.js'
import 'prismjs/components/prism-coffeescript.js'
import 'prismjs/components/prism-diff.js'
import 'prismjs/components/prism-git.js'
import 'prismjs/components/prism-go.js'
import 'prismjs/components/prism-kotlin.js'
import 'prismjs/components/prism-graphql.js'
import 'prismjs/components/prism-handlebars.js'
import 'prismjs/components/prism-less.js'
import 'prismjs/components/prism-makefile.js'
import 'prismjs/components/prism-markdown.js'
import 'prismjs/components/prism-objectivec.js'
import 'prismjs/components/prism-ocaml.js'
import 'prismjs/components/prism-python.js'
import 'prismjs/components/prism-reason.js'
import 'prismjs/components/prism-rust.js'
import 'prismjs/components/prism-sass.js'
import 'prismjs/components/prism-scss.js'
import 'prismjs/components/prism-solidity.js'
import 'prismjs/components/prism-sql.js'
import 'prismjs/components/prism-stylus.js'
import 'prismjs/components/prism-swift.js'
import 'prismjs/components/prism-wasm.js'
import 'prismjs/components/prism-yaml.js'
import "prismjs/components/prism-go.js"

// 定义主容器样式，添加 CSS 过渡动画
const StyledMain = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1120px;
  padding: 0 1rem;
  opacity: 0;  // 初始状态：透明
  transform: translateY(20px);  // 初始状态：下方偏移 20px
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;  // 渐变 + 移动动画，0.5s 缓出
  
  &.loaded {  // 加载完成后添加类，触发动画
    opacity: 1;  // 渐变为完全显示
    transform: translateY(0);  // 回位
  }
`

type Props = {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  const [scheme] = useScheme()
  const [isLoaded, setIsLoaded] = useState(false)  // 状态控制动画类名

  useGtagEffect()
  
  useEffect(() => {
    Prism.highlightAll()  // 初始化代码高亮
  }, [])
  
  useEffect(() => {
    setIsLoaded(true)  // 组件挂载后立即添加 'loaded' 类，触发动画
  }, [])  // 仅挂载时执行

  return (
    <ThemeProvider scheme={scheme}>
      <Scripts />
      <Header fullWidth={false} />
      <StyledMain className={isLoaded ? 'loaded' : ''}>{children}</StyledMain>  
    </ThemeProvider>
  )
}

export default RootLayout