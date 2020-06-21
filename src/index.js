/**
 * LBS MSwipe
 * Date: 2018-9-8
 **/

import utils from './utils'

let _transition_ = utils.prefix('transition')
let _transform_ = utils.prefix('transform')

class MSwipe {
    constructor(el, options = {}) {
        const opts = Object.assign({}, options)

        this.wrapper = utils.query(el)
        if (!this.wrapper) return
        this.scroller = this.wrapper.children[0]

        this.loop = opts.loop == false ? false : true // 循环切换
        this.vertical = opts.vertical || false // 默认水平方向

        this.showIndicator = opts.showIndicator == false ? false : true
        this.indicatorClass = opts.indicatorClass || 'swipe-indicator'
        this.indicatorTag = opts.indicatorTag || 'span'
        this.activeClass = opts.activeClass || 'active'

        this.autoplay = opts.autoplay == 0 ? 0 : 5000
        this.scrollTime = opts.duration || 500

        this.lazyload = opts.lazyload || false
        this.attribute = opts.attribute || 'data-src'

        this.index = opts.index || 0
        this.step = opts.step || 0 // 手动设置每次滚动的步长

        this.locked = opts.locked || false // 锁定手指触发滚动 此时只有autoplay prev next能触发滚动
        this.disable = opts.disable || false // 禁止跟随手指移动

        this.setup = opts.setup || function() {}
        this.scrollStart = opts.scrollStart || function() {}
        this.scrollEnd = opts.scrollEnd || function() {}

        this.$events = {}
        this._init()
    }

    _init() {
        this._initObserve()
        this._initIndicator()
        this._initLazyLoad()
        this._initEvent()
        this.refresh()
    }

    _setup() {
        if (!this._hasInstall) {
            this._hasInstall = true
            if (utils.css(this.wrapper, 'position') === 'static') {
                this.wrapper.style.position = 'relative'
            }
            if (utils.css(this.wrapper, 'overflow') !== 'hidden') {
                this.wrapper.style.overflow = 'hidden'
            }
            this.styleProp = this.vertical ? 'height' : 'width'
        }

        this.items = Array.from(this.scroller.children)
        this.count = this.items.length

        this.items.forEach(item => item.style[this.styleProp] = '')

        this.wrapperSize = this.vertical ? utils.height(this.wrapper) : utils.width(this.wrapper)
        this.itemSize = this.vertical ? utils.height(this.items[0]) : utils.width(this.items[0])

        this.items.forEach(item => item.style[this.styleProp] = this.itemSize + 'px')

        this.scale = this.wrapperSize / this.itemSize

        if (this.scale > 1) {
            this.size = this.step > 0 ? this.step : (this.vertical ? utils.outterHeight(this.items[0]) : utils.outterWidth(this.items[0]))
        } else {
            this.size = this.wrapperSize
        }

        this.totalSize = this.items.reduce((total, item) => total + (this.vertical ? utils.outterHeight(item) : utils.outterWidth(item)), 0)
        this.maxOffset = this.wrapperSize - this.totalSize
        this.maxCount = this.scale > 1 ? Math.ceil(Math.abs(this.maxOffset) / this.size) : this.count - 1

        this.scroller.style[this.styleProp] = this.totalSize + 'px'

        this.offset = 0
        this.duration = 0

        this._scroll()
        this._autoPlay()

        this.$emit('setup', this.index)
    }

    _start(e) {
        this.startX = e.touches[0].pageX
        this.startY = e.touches[0].pageY
        this.startTime = Date.now()
        this._resetTouch()
        this._resetPosition()
        this._clearPlay()
    }

    _move(e) {
        e.stopPropagation()
        if (this.vertical) e.preventDefault()
        if (this.locked) return

        const deltaX = e.touches[0].pageX - this.startX
        const deltaY = e.touches[0].pageY - this.startY

        this.delta = this.vertical ? deltaY : deltaX

        if (this.direction == '') {
            this.direction = utils.getDirection(Math.abs(deltaX), Math.abs(deltaY))
        }

        if (!this.vertical) {
            if (this.direction === 'vertical') return
            if (this.direction === 'horizontal') e.preventDefault()
        }

        if (!this.moving) {
            this.moving = true
        }

        if (!this.loop) {
            if ((this.index == 0 && this.delta > 0) || (this.index == this.maxCount && this.delta < 0)) this.delta /= 4
        }

        if (this.disable) return

        this._scroll({ offset: this.delta })
    }

    _end(e) {
        e.stopPropagation()

        if (!this.moving) {
            this._autoPlay()
            return
        }

        const duration = Date.now() - this.startTime
        const delta = Math.abs(this.delta)
        let pace = 0

        if (delta / duration > 0.25 || delta > this.size / 2) {
            pace = this.delta > 0 ? -1 : 1
        }

        this._scroll({
            pace: pace,
            duration: this.scrollTime
        })
    }

    _resetTouch() {
        this.delta = 0
        this.direction = ''
        this.moving = false
        this.duration = 0
    }

    _resetPosition() {
        if (!this.loop) return

        if (this.index == -1) {
            this._scroll({ pace: this.count })
        }

        if (this.index == this.count) {
            this._scroll({ pace: -this.count })
        }
    }

    _resize() {
        this._resizeTimer && clearTimeout(this._resizeTimer)
        this._resizeTimer = setTimeout(() => {
            this._clearPlay()
            this.refresh()
        }, 100)
    }

    _visibility() {
        if (document.hidden) {
            this._clearPlay()
        } else {
            this._autoPlay()
        }
    }

    _scroll(ref = {}) {
        const offset = ref.offset || 0
        const pace = ref.pace || 0
        const duration = ref.duration

        const targetIndex = this._getTargetIndex(pace)
        const targetOffset = this._getTargetOffset(targetIndex, offset)
        const oldIndex = this.index

        if (this.loop) {
            this._setItemTransform(this.items[this.count - 1], targetIndex <= 0 ? -this.totalSize : '')
            this._setItemTransform(this.items[0], targetIndex >= this.count - 1 ? this.totalSize : '')
        }

        if (duration) {
            this.duration = duration
            if (pace != 0) {
                this.scrolling = true
                this.$emit('scrollStart', this.oIndex = (oldIndex + this.count) % this.count)
            }
        }

        this.index = targetIndex
        this.offset = targetOffset
    }

    _scrollEnd() {
        this.duration = 0
        if (this.scrolling) {
            this.scrolling = false
            this.$emit('scrollEnd', (this.index + this.count) % this.count, this.oIndex)
        }
        this._autoPlay()
    }

    _getTargetIndex(pace) {
        if (pace == 0) return this.index

        const index = this.index + pace

        if (this.loop) {
            return utils.range(index, -1, this.count)
        }

        if (this.autoplay) {
            if (index > this.maxCount) return 0
            if (index < 0) return this.maxCount
            return index
        }

        return utils.range(index, 0, this.maxCount)
    }

    _getTargetOffset(index, offset) {
        let currentPosition = index * this.size

        if (!this.loop) {
            currentPosition = Math.min(currentPosition, -this.maxOffset)
        }

        let targetOffset = offset - currentPosition

        // if (!this.loop) {
        //     targetOffset = utils.range(targetOffset, this.maxOffset, 0)
        // }

        return targetOffset
    }

    _setTransition(duration = 0) {
        this.scroller.style[_transition_] = duration != 0 ? ('all ' + duration + 'ms') : ''
    }

    _setTransform(offset) {
        this._setItemTransform(this.scroller, offset)
        this.$emit('scrollMove', offset)
    }

    _setItemTransform(item, offset) {
        if (offset != '') {
            item.style[_transform_] = this.vertical ? 'translate3d(0px, ' + offset + 'px, 0px)' : 'translate3d(' + offset + 'px, 0px, 0px)'
        } else {
            item.style[_transform_] = ''
        }
    }

    _initEvent() {
        utils.on(this.wrapper, 'touchstart', this.start = this._start.bind(this))
        utils.on(this.wrapper, 'touchmove', this.move = this._move.bind(this))
        utils.on(this.wrapper, 'touchend', this.end = this._end.bind(this))
        utils.on(this.scroller, ['transitionend', 'webkitTransitionEnd'], this.transitionEnd = this._scrollEnd.bind(this))
        utils.on(window, 'resize', this.resize = this._resize.bind(this))
        utils.on(window, 'visibilitychange', this.visibility = this._visibility.bind(this))

        this.$on('setup', this.setup)
        this.$on('scrollStart', this.scrollStart)
        this.$on('scrollEnd', this.scrollEnd)
    }

    _initObserve() {
        utils.observe(this, ['offset', 'duration'], () => {
            this._setTransition(this.duration)
            this._setTransform(this.offset)
        })
    }

    _initIndicator() {
        if (!this.showIndicator || this.count < 2) return
        let indicatorItems = []
        let indicator = document.createElement('div')
        let setup = () => {
            indicatorItems = []
            indicator.innerHTML = ''
            for (let i = 0; i < this.count; i++) {
                let span = document.createElement(this.indicatorTag)
                i === this.index && (span.className = this.activeClass)
                indicator.appendChild(span)
                indicatorItems.push(span)
            }
        }
        indicator.className = this.indicatorClass
        this.wrapper.appendChild(indicator)
        this.$on('setup', () => {
            setup()
        })
        this.$on('scrollEnd', (index, oIndex) => {
            indicatorItems[oIndex].className = ''
            indicatorItems[index].className = this.activeClass
        })
    }

    _initLazyLoad() {
        if (!this.lazyload) return
        const loadImage = (item) => {
            if (!item) return
            if (item.__loaded) return
            const imgs = item.getElementsByTagName('img')
            const n = imgs.length
            if (!n) return
            item.__loaded = true
            for (let i = 0; i < n; i++) {
                let img = imgs[i]
                if (img.getAttribute(this.attribute)) {
                    img.classList.add('loaded')
                    img.setAttribute('src', img.getAttribute(this.attribute))
                    img.removeAttribute(this.attribute)
                }
            }
        }
        const lazyLoad = (index) => {
            if (!(this.scale > 1)) return loadImage(this.items[index])
            for (let i = 0; i < this.count; i++) {
                let item = this.items[i]
                if (item.__loaded) continue
                const rect = item.getBoundingClientRect()
                const wrapperRect = this.wrapper.getBoundingClientRect()
                const visible = this.vertical ? (rect.top < wrapperRect.bottom && rect.bottom > wrapperRect.top) : (rect.left < wrapperRect.right && rect.right > wrapperRect.left)
                if (visible) {
                    loadImage(item)
                }
            }
        }
        this.$on('setup', index => {
            lazyLoad(index)
        })
        this.$on('scrollEnd', index => {
            lazyLoad(index)
        })
    }

    _autoPlay() {
        if (this.autoplay < 1 || this.count < 2) return
        this._clearPlay()
        this._autoTimer = setTimeout(() => {
            this.next()
            this._autoPlay()
        }, this.autoplay)
    }

    _clearPlay() {
        clearTimeout(this._autoTimer)
        this._autoTimer = null
    }

    $emit(type) {
        if (!this.$events[type]) return
        let n = this.$events[type].length
        if (!n) return
        for (let i = 0; i < n; i++) {
            this.$events[type][i].apply(this, [].slice.call(arguments, 1))
        }
    }

    $on(type, fn) {
        if (!this.$events[type]) this.$events[type] = []
        this.$events[type].push(fn)
    }

    $off(type, fn) {
        if (!this.$events[type]) return
        let index = this.$events[type].indexOf(fn)
        if (index > -1) {
            this.$events[type].splice(index, 1)
        }
    }

    refresh() {
        this._setup()
        this.$emit('refresh')
    }

    prev() {
        if (this.scrolling) return
        if (this.destroyed) return
        this._clearPlay()
        this._resetPosition()
        setTimeout(() => {
            this._scroll({
                pace: -1,
                duration: this.scrollTime
            })
        }, 100)
    }

    next() {
        if (this.scrolling) return
        if (this.destroyed) return
        this._clearPlay()
        this._resetPosition()
        setTimeout(() => {
            this._scroll({
                pace: 1,
                duration: this.scrollTime
            })
        }, 100)
    }

    destroy() {
        this.destroyed = true
        this.$emit('destroy')
        this.$events = {}
        this._clearPlay()
        utils.off(this.wrapper, 'touchstart', this.start)
        utils.off(this.wrapper, 'touchmove', this.move)
        utils.off(this.wrapper, 'touchend', this.end)
        utils.off(this.scroller, ['transitionend', 'webkitTransitionEnd'], this.transitionEnd)
        utils.off(window, 'resize', this.resize)
        utils.off(window, 'visibilitychange', this.visibility)
    }
}

export default MSwipe