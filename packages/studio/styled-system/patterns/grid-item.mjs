import { mapObject } from '../helpers.mjs'
import { css, cx } from '../css/index.mjs'

const gridItemConfig = {
  transform(props, { map }) {
    const { colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd, ...rest } = props
    const spanFn = (v) => (v === 'auto' ? v : `span ${v}`)
    return {
      gridColumn: colSpan != null ? map(colSpan, spanFn) : void 0,
      gridRow: rowSpan != null ? map(rowSpan, spanFn) : void 0,
      gridColumnStart: colStart,
      gridColumnEnd: colEnd,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
      ...rest,
    }
  },
}

export const getGridItemStyle = (styles = {}) => gridItemConfig.transform(styles, { map: mapObject })

export const gridItem = ({ css: cssStyles, ...styles } = {}) => cx(css(getGridItemStyle(styles)), css(cssStyles))
gridItem.raw = (styles) => styles
