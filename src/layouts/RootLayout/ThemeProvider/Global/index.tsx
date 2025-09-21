import { Global as _Global, css, useTheme } from "@emotion/react"
import { ThemeProvider as _ThemeProvider } from "@emotion/react"
import { pretendard } from "src/assets"

export const Global = () => {
  const theme = useTheme()

  return (
    <_Global
      styles={css`
        /* 添加动画关键帧 */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        /* 修复移动端溢出问题 */
        html, body {
          width: 100%;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }

        body {
          color: ${theme.colors.gray12};
          background-color: ${theme.colors.gray2};
          font-family: ${pretendard.style.fontFamily};
          font-weight: ${pretendard.style.fontWeight};
          font-style: ${pretendard.style.fontStyle};
          position: relative;
        }

        * {
          color-scheme: ${theme.scheme};
          box-sizing: border-box;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          font-weight: inherit;
          font-style: inherit;
        }

        a {
          all: unset;
          cursor: pointer;
          transition: color 0.3s ease, transform 0.2s ease;
        }

        a:hover {
          transform: translateY(-1px);
        }

        ul {
          padding: 0;
        }

        // init button
        button {
          all: unset;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        button:hover {
          transform: scale(1.05);
        }

        // init input
        input {
          all: unset;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        // init textarea
        textarea {
          border: none;
          background-color: transparent;
          font-family: inherit;
          padding: 0;
          outline: none;
          resize: none;
          color: inherit;
          transition: all 0.3s ease;
        }

        hr {
          width: 100%;
          border: none;
          margin: 0;
          border-top: 1px solid ${theme.colors.gray6};
          transition: border-color 0.3s ease;
        }
        
        /* 添加动画类 */
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        /* 添加以下代码覆盖Notion渲染字体 */
        .notion-app,
        .notion-app *,
        .notion-text,
        .notion-list,
        .notion-page,
        .notion-column,
        .notion-link,
        .notion-toggle,
        .notion-block,
        .notion-heading,
        .notion-code,
        .notion-quote,
        .notion-callout,
        .notion-table,
        .notion-row,
        .notion-cell {
          font-family: ${pretendard.style.fontFamily} !important;
        }

        /* 特别处理代码块 */
        .notion-code {
          font-family: "LXGW WenKai", "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace !important;
        }

        /* 响应式修复 */
        @media (max-width: 768px) {
          .notion-page {
            width: 100% !important;
            padding: 0 10px !important;
          }
          
          .notion-column {
            min-width: 100% !important;
          }
        }
      `}
    />
  )
}