# MSwipe

轮播、焦点图、跑马灯，支持水平、垂直方向选择，循环切换，导航指示显示，自动播放，图片懒加载。

## 安装
```
npm install @eyeear/mswipe --save

```

## 使用
```
import MSwipe from '@eyeear/mswipe'

OR

<script src="lib/mswipe.js"></script>

```

```
  <div class="wrapper">
      <div class="scroller">
          <div class="item">...</div>
          <div class="item"><img src="placeholder.png" data-src="1.jpg" /></div>
          ...
      </div>
  </div>
```

```
  // 默认(水平方向 循环切换 显示导航指示 自动播放)
  new MSwipe('.wrapper')

  // 垂直方向 不循环切换 不显示导航指示 不自动播放
  new MSwipe('.wrapper', {
      vertical: true,
      loop: false,
      showIndicator: false,
      autoplay: 0
  })

  // 默认 + 图片懒加载
  new MSwipe('.wrapper', {
      lazyload: true
  })

  ...

  ...
  
```

## 选项
```
  new MSwipe(el, options)

  el 
    - 必须设置 外围包裹元素 一个css选择器或者元素对象
  
  options
    -选项属性
    - loop 是否循环切换 默认 true
    - vertical 是否垂直方向 默认 false 
    - showIndicator 是否显示导航指示 默认true
      - indicatorClass 导航指示容器类名 默认 'swipe-indicator' 
      - indicatorTag 导航指示html标签 默认 'span'
      - activeClass 导航指示当前激活项类名 默认 'active' 
    - autoplay  是否自动播放 默认 5000 (自动播放间隔时间 ms)  设置为0不自动播放
      - duration 滚动动画的持续时间 默认 500 (ms)
    - lazyload 是否图片懒加载 默认false
      - attribute 放置图片地址的特性 默认 data-src  
    - index 切换到哪一项的索引 默认 0
    - step 手动设置滚动的步长 (一般用于单项尺寸小于包裹容器尺寸时)
    - locked 锁定手指触发滚动 此时只有autoplay prev next能触发滚动 默认 false
    - disable 手指触摸移动时禁止跟随手指移动 默认 false
    
    -选项方法
    - setup 第一次设置完成、浏览器resize 执行回调
    - scrollStart 滚动开始执行回调
    - scrollEnd 滚动结束执行回调

  instance 实例方法
    - refresh() 项目数量发生变化时 手动刷新
    - prev() 滚动到上一项 
    - next() 滚动到下一项
    - destroy() 要销毁实例时调用 注销事件绑定
```