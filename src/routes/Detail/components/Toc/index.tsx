import styled from "@emotion/styled"
import React, { useState, useEffect, useRef } from "react"

export type THeading = {
  id: string
  type: string
  text: string
}

type Props = {
  headings: THeading[]
}

const Toc: React.FC<Props> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>("")
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-20% 0% -35% 0px",
    })

    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    elements.forEach((elem) => observer.current?.observe(elem))

    return () => observer.current?.disconnect()
  }, [headings])

  if (!headings || headings.length === 0) {
    return null
  }

  return (
    <StyledWrapper>
      <div className="content">
        <div className="title">CONTENTS</div>
        <ul>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`heading-${heading.type} ${
                heading.id === activeId ? "active" : ""
              }`}
            >
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </div>
    </StyledWrapper>
  )
}

export default Toc

const StyledWrapper = styled.div`
  .content {
    padding: 0;
    background-color: transparent;
  }

  .title {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.gray11};
    text-transform: uppercase;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    border-left: 1px solid ${({ theme }) => theme.colors.gray4};
  }

  li {
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;

    a {
      text-decoration: none;
      color: ${({ theme }) => theme.colors.gray10};
      font-size: 0.875rem;

      &:hover {
        color: ${({ theme }) => theme.colors.gray12};
      }
    }

    &.active {
      border-left: 2px solid ${({ theme }) => theme.colors.gray12};
      margin-left: -1px;

      a {
        color: ${({ theme }) => theme.colors.gray12};
        font-weight: 600;
      }
    }
  }

  .heading-header {
    /* H1 */
  }
  .heading-sub_header {
    /* H2 */
    margin-left: 1rem;
  }
  .heading-sub_sub_header {
    /* H3 */
    margin-left: 2rem;
  }
`