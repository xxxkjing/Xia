import { DEFAULT_CATEGORY } from "src/constants"
import { useRouter } from "next/router"
import React from "react"
import styled from "@emotion/styled"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"

type Props = {}

const CategorySelect: React.FC<Props> = () => {
  const router = useRouter()
  const data = useCategoriesQuery()

  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY

  const handleClickCategory = (category: string) => {
    if (currentCategory === category) {
      router.push({
        query: {
          ...router.query,
          category: undefined,
        },
      })
    } else {
      router.push({
        query: {
          ...router.query,
          category,
        },
      })
    }
  }

  return (
    <StyledWrapper>
      <div className="list">
        {Object.keys(data).map((key) => (
          <a
            key={key}
            data-active={key === currentCategory}
            onClick={() => handleClickCategory(key)}
          >
            {`${key} (${data[key]})`}
          </a>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default CategorySelect

const StyledWrapper = styled.div`
  .list {
    display: flex;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
    overflow-x: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    @media (min-width: 1024px) {
      flex-wrap: wrap;
      overflow-x: visible;
    }

    a {
      display: block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.75rem;
      font-size: 1rem;
      line-height: 1.5rem;
      color: ${({ theme }) => theme.colors.gray10};
      flex-shrink: 0;
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.gray4};

      :hover {
        background-color: ${({ theme }) => theme.colors.gray6};
      }
      &[data-active="true"] {
        color: ${({ theme }) => theme.colors.gray12};
        background-color: ${({ theme }) => theme.colors.gray6};
      }
    }
  }
`