document.addEventListener('DOMContentLoaded', () => {
  // --- プラグインインポート ---
  gsap.registerPlugin(SplitText, ScrollTrigger);

  // --- ヘルパー関数 ---
  /**
   * GSAPアニメーションの共通設定を要素のdata属性から取得するヘルパー関数。
   * @param {HTMLElement} el - 設定を取得する対象要素。
   * @returns {Object} 取得した設定値を含むオブジェクト。
   */
  const getGsapAnimationSettings = (el) => {
    const offsetAttr = el.getAttribute('data-gsap-offset');
    let offset = 'top 80%';

    if (offsetAttr) {
      if (offsetAttr.includes(' ')) {
        offset = offsetAttr;
      } else {
        offset = `top ${offsetAttr}`;
      }
    }

    const triggerSelector = el.getAttribute('data-gsap-trigger');

    let triggerEl = el; // デフォルトは要素自身
    if (triggerSelector) {
      const foundTrigger = document.querySelector(triggerSelector);

      if (foundTrigger) {
        triggerEl = foundTrigger;
      }
    }

    return {
      duration: parseFloat(el.getAttribute('data-gsap-duration')) || 1,
      delay: parseFloat(el.getAttribute('data-gsap-delay')) || 0,
      ease: el.getAttribute('data-gsap-ease') || 'expo.inOut',
      offset: offset,
      distance: parseFloat(el.getAttribute('data-gsap-distance')) || 50,
      color: el.getAttribute('data-gsap-color') || 'skyblue',
      stagger: parseFloat(el.getAttribute('data-gsap-stagger')) || 0.05,
      triggerEl: triggerEl,
    };
  };

  //----------------------------------------------------------------------------------------------------

  // --- テキスト表示アニメーション ---

  /**
   * slide-horizontal
   * 左から右へワイプされるように表示するアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateSlideHorizontal = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true
      },
    });

    gsap.set(el, { autoAlpha: 0 });

    tl.set(el, { display: 'inline-block' }); // clip-pathが機能するために必要

    tl.fromTo(el,
      { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
      {
        autoAlpha: 1,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease
      }
    );
  };

  /**
   * slide-vertical
   * 上から下へワイプされるように表示するアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateSlideVertical = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    gsap.set(el, { autoAlpha: 0 });

    tl.set(el, { display: 'inline-block' }); // clip-pathが機能するために必要

    tl.fromTo(el,
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
      {
        autoAlpha: 1,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease
      }
    );
  };

  /**
   * text-slide-horizontal
   * テキストの各行が左から右へワイプされるように順に表示するアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素（親コンテナ）。
   */
  const animateTextSlideHorizontal = (el) => {
    const settings = getGsapAnimationSettings(el);

    const splitText = new SplitText(el, {
      type: "lines",
      linesClass: "line",
      lineBreak: "<br>",
    });

    gsap.set(el, { autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
      delay: settings.delay,
    });

    tl.set(el, { autoAlpha: 1 });

    tl.fromTo(
      splitText.lines,
      {
        autoAlpha: 0,
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        width: 'fit-content',
      },
      {
        autoAlpha: 1,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: settings.duration,
        ease: settings.ease,
        stagger: 0.2,
      }
    );
  };

  /**
   * text-slide-vertical
   * テキストの各行が上から下へワイプされるように順に表示するアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateTextSlideVertical = (el) => {
    const settings = getGsapAnimationSettings(el);

    const splitText = new SplitText(el, {
      type: "lines",
      linesClass: "line",
      lineBreak: "<br>",
    });

    gsap.set(el, { autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
      delay: settings.delay,
    });

    tl.set(el, { autoAlpha: 1 });

    tl.fromTo(
      splitText.lines,
      {
        autoAlpha: 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        display: 'block',
        height: 'fit-content',
      },
      {
        autoAlpha: 1,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: settings.duration,
        ease: settings.ease,
        stagger: 0.2,
      }
    );
  };

  /**
   * overlay-horizontal
   * 要素の上にオーバーレイを重ね、そのオーバーレイが上から下へスライドするアニメーション
   * @param {HTMLElement} el - アニメーションを適用する要素（親コンテナ）。
   */
  const animateOverlayHorizontal = (el) => {
    const settings = getGsapAnimationSettings(el);
    const overlayEl = document.createElement('div');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    gsap.set(el, {
      autoAlpha: 0,
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
    });

    gsap.set(overlayEl, {
      zIndex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: settings.color,
    });
    el.appendChild(overlayEl);
    
    tl.to(overlayEl, {
      xPercent: 100,
      duration: settings.duration,
      delay: settings.delay,
      ease: settings.ease,
    });

    tl.to(el,
      {
        autoAlpha: 1,
        duration: 0.2,
      },
      '<0.2',
    );
  };

  /**
   * overlay-vertical
   * 要素の上にオーバーレイを重ね、そのオーバーレイが上から下へスライドするアニメーション
   * @param {HTMLElement} el - アニメーションを適用する要素（親コンテナ）。
   */
  const animateOverlayVertical = (el) => {
    const settings = getGsapAnimationSettings(el);
    const overlayEl = document.createElement('div');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    gsap.set(el, {
      autoAlpha: 0,
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
    });

    gsap.set(overlayEl, {
      zIndex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: settings.color,
    });
    el.appendChild(overlayEl);
    
    tl.to(overlayEl, {
      yPercent: 100,
      duration: settings.duration,
      delay: settings.delay,
      ease: settings.ease,
    });

    tl.to(el,
      {
        autoAlpha: 1,
        duration: 0.2,
      },
      '<0.2',
    );
  };

  /**
   * text-overlay-horizontal
   * 要素の上にオーバーレイを重ね、そのオーバーレイが上から下へスライドすることでキストを順番に表示するアニメーション
   * @param {HTMLElement} el - アニメーションを適用する要素（親コンテナ）。
   */
  const animateTextOverlayHorizontal = (el) => {
    const settings = getGsapAnimationSettings(el);

    const splitText = new SplitText(el, {
      type: "lines",
      linesClass: "line",
      lineBreak: "<br>",
    });

    gsap.set(el, {
      autoAlpha: 0,
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
      delay: settings.delay,
    });

    tl.set(el, { autoAlpha: 1, });

    splitText.lines.forEach((line, index) => {
      gsap.set(line, { position: 'relative', overflow: 'hidden', margin: '0.1em 0', });

      const lineOverlay = document.createElement('div');
      gsap.set(lineOverlay, {
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: settings.color,
        xPercent: 0,
      });
      line.appendChild(lineOverlay);

      tl.to(lineOverlay, {
        xPercent: 100,
        duration: settings.duration,
        ease: settings.ease,
      }, index * 0.2);

      tl.fromTo(line,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.2,
          ease: 'none',
        },
        `<`
      );
    });
  };

  /**
   * text-overlay-vertical
   * 要素の上にオーバーレイを重ね、そのオーバーレイが上から下へスライドすることでキストを順番に表示するアニメーション
   * @param {HTMLElement} el - アニメーションを適用する要素（親コンテナ）。
   */
  const animateTextOverlayVertical = (el) => {
    const settings = getGsapAnimationSettings(el);

    const splitText = new SplitText(el, {
      type: "lines",
      linesClass: "line",
      lineBreak: "<br>",
    });

    gsap.set(el, {
      autoAlpha: 0,
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
      delay: settings.delay,
    });

    tl.set(el, { autoAlpha: 1, });

    splitText.lines.forEach((line, index) => {
      gsap.set(line, { position: 'relative', overflow: 'hidden', margin: '0 0.1em', });

      const lineOverlay = document.createElement('div');
      gsap.set(lineOverlay, {
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: settings.color,
        yPercent: 0,
      });
      line.appendChild(lineOverlay);

      tl.to(lineOverlay, {
        yPercent: 100,
        duration: settings.duration,
        ease: settings.ease,
      }, index * 0.2);

      tl.fromTo(line,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.2,
          ease: 'none',
        },
        `<`
      );
    });
  };

  /**
   * text-char-up
   * テキストを文字単位で下から上へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateTextCharUp = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // SplitTextでテキストを行と文字に分割 (各行はoverflow: hidden;を持つラッパーで囲まれる)
    const splitText = SplitText.create(el, {
      type: 'lines,chars',
      charsClass: 'char',
      linesClass: 'line',
      mask: 'lines',
    });

    // 親要素をタイムライン開始時に表示
    tl.set(el, { autoAlpha: 1 });

    // 各文字を下から上へスライドしながらフェードイン
    tl.fromTo(splitText.chars,
      {
        autoAlpha: 0,
        yPercent: 100,
      },
      {
        autoAlpha: 1,
        yPercent: 0,
        stagger: settings.stagger,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * text-masked-line
   * テキストを行単位で下から上へスライドして表示するアニメーション。
   * スクロール量に厳密に連動してアニメーションが進行する。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateTextMaskedLine = (el) => {
    const settings = getGsapAnimationSettings(el);

    // SplitTextでテキストを行に分割 (各行はoverflow: hidden;を持つラッパーで囲まれる)
    const splitText = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        scrub: true, // スクロールに厳密に連動
        start: "clamp(top center)",
        end: "clamp(bottom center)"
      },
    });

    // 親要素をタイムライン開始時に表示
    gsap.set(el, { opacity: 1 });

    // 各行を下から上へスライドして表示
    tl.from(splitText.lines, {
      yPercent: 120,
      stagger: 0.1,
    });
  };

  //----------------------------------------------------------------------------------------------------

  // --- フェードアニメーション ---

  /**
   * fade-in
   * 要素全体がフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeIn = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    gsap.set(el, { autoAlpha: 0 });

    tl.fromTo(
      el,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * fade-up
   * 要素が下から上へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeUp = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // 要素を透明かつ下へ移動
    tl.set(el, { autoAlpha: 0 });

    // 要素を上へスライドしながらフェードイン
    tl.fromTo(
      el,
      {
        autoAlpha: 0,
        y: settings.distance,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * fade-down
   * 要素が上から下へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeDown = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // 要素を透明かつ上へ移動
    tl.set(el, { autoAlpha: 0 });

    // 要素を下へスライドしながらフェードイン
    tl.fromTo(
      el,
      {
        autoAlpha: 0,
        y: - settings.distance,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * fade-right
   * 要素が左から右へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeRight = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // 要素を透明かつ左へ移動
    tl.set(el, { autoAlpha: 0 });

    // 要素を右へスライドしながらフェードイン
    tl.fromTo(
      el,
      {
        autoAlpha: 0,
        x: - settings.distance,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * fade-left
   * 要素が右から左へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeLeft = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // 要素を透明かつ右へ移動
    tl.set(el, { autoAlpha: 0 });

    // 要素を左へスライドしながらフェードイン
    tl.fromTo(
      el,
      {
        autoAlpha: 0,
        x: settings.distance,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * fade-up-right
   * 要素が左下から右上へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeUpRight = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // 要素を透明かつ左下へ移動
    tl.set(el, { autoAlpha: 0 });

    // 要素を右上へスライドしながらフェードイン
    tl.fromTo(
      el,
      {
        autoAlpha: 0,
        y: settings.distance,
        x: - settings.distance,
      },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * fade-up-left
   * 要素が右下から左上へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeUpLeft = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // 要素を透明かつ右下へ移動
    tl.set(el, { autoAlpha: 0 });

    // 要素を左上へスライドしながらフェードイン
    tl.fromTo(
      el,
      {
        autoAlpha: 0,
        y: settings.distance,
        x: settings.distance,
      },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * fade-down-right
   * 要素が左上から右下へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeDownRight = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // 要素を透明かつ左上へ移動
    tl.set(el, { autoAlpha: 0 });

    // 要素を右下へスライドしながらフェードイン
    tl.fromTo(
      el,
      {
        autoAlpha: 0,
        y: - settings.distance,
        x: - settings.distance,
      },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  /**
   * fade-down-left
   * 要素が右上から左下へスライドしながらフェードインするアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateFadeDownLeft = (el) => {
    const settings = getGsapAnimationSettings(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: settings.offset,
        once: true,
      },
    });

    // 要素を透明かつ右上へ移動
    tl.set(el, { autoAlpha: 0 });

    // 要素を左下へスライドしながらフェードイン
    tl.fromTo(
      el,
      {
        autoAlpha: 0,
        y: - settings.distance,
        x: settings.distance,
      },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: settings.duration,
        delay: settings.delay,
        ease: settings.ease,
      },
    );
  };

  //----------------------------------------------------------------------------------------------------

  // --- パララックスアニメーション ---

  /**
   * parallax
   * 要素自体をスクロールに応じて上下に移動させることで、視差効果を生み出すアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する要素。
   */
  const animateParallax = (el) => {
    const settings = getGsapAnimationSettings(el);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1, // スクロールに連動
      },
    });

    // 要素がスクロール領域に入り始めてから出るまでの間、y軸方向に移動
    timeline.fromTo(el,
      {
        y: settings.distance,
      },
      {
        y: - settings.distance,
      }
    );
  };

  /**
   * parallax-bg
   * 親要素の範囲内で、内部の背景画像（`img`要素）をスクロールに応じて上下に移動させ、
   * 手前のコンテンツとの間に視差効果を生み出すアニメーション。
   * @param {HTMLElement} el - アニメーションを適用する親コンテナ要素。
   */
  const animateParallaxBg = (el) => {
    const settings = getGsapAnimationSettings(el);

    const y = 20; // 画像の相対的な移動量係数
    const imageEl = el.querySelector('img');

    el.style.overflow = 'hidden'; // 親要素の余分な部分を隠す
    imageEl.style.height = `${100 + y}%`; // 画像の高さに移動できる範囲を確保

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: settings.triggerEl,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1, // スクロールに連動
      },
    });

    // 画像要素をy軸方向に移動
    timeline.to(imageEl, {
      yPercent: (100 / (100 + y)) * y * -1,
    });
  };

  //----------------------------------------------------------------------------------------------------

  // --- アニメーションの初期化 ---
  const animationsMap = {
    'slide-horizontal': animateSlideHorizontal,
    'slide-vertical': animateSlideVertical,
    'text-slide-horizontal': animateTextSlideHorizontal,
    'text-slide-vertical': animateTextSlideVertical,
    'overlay-horizontal': animateOverlayHorizontal,
    'overlay-vertical': animateOverlayVertical,
    'text-overlay-horizontal': animateTextOverlayHorizontal,
    'text-overlay-vertical': animateTextOverlayVertical,
    'text-char-up': animateTextCharUp,
    'text-masked-line': animateTextMaskedLine,
    'fade-in': animateFadeIn,
    'fade-up': animateFadeUp,
    'fade-down': animateFadeDown,
    'fade-right': animateFadeRight,
    'fade-left': animateFadeLeft,
    'fade-up-right': animateFadeUpRight,
    'fade-up-left': animateFadeUpLeft,
    'fade-down-right': animateFadeDownRight,
    'fade-down-left': animateFadeDownLeft,
    'parallax': animateParallax,
    'parallax-bg': animateParallaxBg,
  };

  for (const dataGsapAttr in animationsMap) {
    const elements = gsap.utils.toArray(`[data-gsap="${dataGsapAttr}"]`);
    const animateFn = animationsMap[dataGsapAttr];
    elements.forEach((el) => animateFn(el));
  }
});