import type { ReactElement } from 'react'
import { useEffect, useRef, useMemo } from 'react'
import type { Heading } from 'nextra'
import scrollIntoView from 'scroll-into-view-if-needed'

import { renderComponent } from '../utils'
import { useConfig, useActiveAnchor } from '../contexts'
import { Anchor } from './anchor'
import { css, cx } from '../../styled-system/css'

export type TOCProps = {
  headings: Heading[]
  filePath: string
}

export function TOC({ headings, filePath }: TOCProps): ReactElement {
  const activeAnchor = useActiveAnchor()
  const config = useConfig()
  const tocRef = useRef<HTMLDivElement>(null)

  const items = useMemo(
    () => headings.filter(heading => heading.depth > 1),
    [headings]
  )

  const hasHeadings = items.length > 0
  const hasMetaInfo = Boolean(
    config.feedback.content ||
      config.editLink.component ||
      config.toc.extraContent
  )

  const activeSlug = Object.entries(activeAnchor).find(
    ([, { isActive }]) => isActive
  )?.[0]

  useEffect(() => {
    if (!activeSlug) return
    const anchor = tocRef.current?.querySelector(
      `li > a[href="#${activeSlug}"]`
    )

    if (anchor) {
      scrollIntoView(anchor, {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: tocRef.current
      })
    }
  }, [activeSlug])

  const linkClassName = cx(
    css({
      textStyle: 'xs',
      fontWeight: 'medium',
      color: 'gray.500',
      _hover: { color: 'gray.900' },
      _dark: {
        color: 'gray.400',
        _hover: { color: 'gray.100' }
      },
      _moreContrast: {
        color: 'gray.800',
        _dark: { color: 'gray.50' }
      }
    })
  )

  return (
    <div
      ref={tocRef}
      className={cx(
        'nextra-scrollbar',
        css({
          position: 'sticky',
          top: 16,
          overflowY: 'auto',
          paddingRight: 4,
          paddingTop: 6,
          textStyle: 'sm',
          hyphens: 'auto',
          maxHeight:
            'calc(100vh - var(--nextra-navbar-height) - env(safe-area-inset-bottom))',
          _ltr: { marginRight: 4 },
          _rtl: { marginLeft: 4 }
        })
      )}
    >
      {hasHeadings && (
        <>
          <p
            className={css({
              mb: 4,
              fontWeight: 'semibold',
              letterSpacing: 'tight'
            })}
          >
            {renderComponent(config.toc.title)}
          </p>
          <ul>
            {items.map(({ id, value, depth }) => (
              <li
                className={css({ my: 2, scrollMarginY: 6, scrollPaddingY: 6 })}
                key={id}
              >
                <a
                  href={`#${id}`}
                  className={cx(
                    {
                      2: css({ fontWeight: 'semibold' }),
                      3: css({ _ltr: { pl: 4 }, _rtl: { pr: 4 } }),
                      4: css({ _ltr: { pl: 8 }, _rtl: { pr: 8 } }),
                      5: css({ _ltr: { pl: 12 }, _rtl: { pr: 12 } }),
                      6: css({ _ltr: { pl: 16 }, _rtl: { pr: 16 } })
                    }[depth as Exclude<typeof depth, 1>],
                    css({ display: 'inline-block' }),
                    activeAnchor[id]?.isActive
                      ? css({
                          color: 'primary.600',
                          WebkitFontSmoothing: 'auto',
                          MozOsxFontSmoothing: 'auto',
                          _moreContrast: { color: 'primary.600!' }
                        })
                      : css({
                          color: 'gray.500',
                          _hover: { color: 'gray.900' },
                          _dark: {
                            color: 'gray.400',
                            _hover: { color: 'gray.300' }
                          }
                        }),
                    css({
                      _moreContrast: {
                        color: 'gray.900',
                        textDecoration: 'underline',
                        w: 'full',
                        overflowWrap: 'break-word',
                        _dark: { color: 'gray.50' }
                      }
                    })
                  )}
                >
                  {config.toc.headingComponent?.({
                    id,
                    children: value
                  }) ?? value}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasMetaInfo && (
        <div
          className={cx(
            hasHeadings &&
              css({
                mt: 8,
                borderTop: '1px solid',
                bg: 'white',
                pt: 8,
                shadow: '0 -12px 16px white',
                _dark: {
                  bg: 'dark',
                  shadow: '0 -12px 16px #111',
                  borderColor: 'neutral.800'
                },
                position: 'sticky',
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
                pb: 8,
                _moreContrast: {
                  borderTop: '1px solid',
                  borderColor: 'neutral.400',
                  shadow: 'none',
                  _dark: {
                    borderColor: 'neutral.400'
                  }
                }
              })
          )}
        >
          {config.feedback.content ? (
            <Anchor
              className={linkClassName}
              href={config.feedback.useLink()}
              newWindow
            >
              {renderComponent(config.feedback.content)}
            </Anchor>
          ) : null}

          {renderComponent(config.editLink.component, {
            filePath,
            className: linkClassName,
            children: renderComponent(config.editLink.text)
          })}

          {renderComponent(config.toc.extraContent)}
        </div>
      )}
    </div>
  )
}
