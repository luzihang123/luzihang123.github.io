(() => {
  const root = window.GLOBAL_CONFIG_SITE?.root || '/'
  const withRoot = path => `${root.replace(/\/$/, '')}${path}`
  const isHome = location.pathname === withRoot('') || location.pathname === withRoot('/index.html')

  if (!isHome) return

  const stickyLayout = document.querySelector('#aside-content .sticky_layout')
  if (!stickyLayout || document.getElementById('card-shuoshuo-widget')) return

  const renderCard = items => {
    if (!items.length) return

    const card = document.createElement('div')
    card.id = 'card-shuoshuo-widget'
    card.className = 'card-widget card-shuoshuo-widget'
    card.innerHTML = `
      <div class="item-headline">
        <i class="fas fa-comment-dots"></i>
        <span>最新说说</span>
      </div>
      <div class="item-content">
        ${items.map(item => `
          <div class="shuoshuo-widget__item">
            <div class="shuoshuo-widget__date">${item.date}</div>
            <a class="shuoshuo-widget__title" href="${item.path}">${item.title}</a>
            <div class="shuoshuo-widget__summary">${item.summary}</div>
          </div>
        `).join('')}
        <a class="shuoshuo-widget__more" href="${withRoot('/s/')}">进入说说页 →</a>
      </div>
    `

    const recentPostCard = stickyLayout.querySelector('.card-recent-post')
    if (recentPostCard?.nextSibling) {
      stickyLayout.insertBefore(card, recentPostCard.nextSibling)
      return
    }

    stickyLayout.prepend(card)
  }

  fetch(withRoot('/api/shuoshuo.json'))
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load shuoshuo feed: ${response.status}`)
      return response.json()
    })
    .then(renderCard)
    .catch(error => {
      console.error(error)
    })
})()
