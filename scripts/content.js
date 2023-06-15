const isCommentPage = () => {
  if (window.location.href.includes('/comments/')) return true;
  else return false;
}


const getDesign = () => {
  let htmlCLass = document.documentElement.className;
  if (htmlCLass.includes('theme-beta')) {
    if (htmlCLass.includes('is-shredtop-pdp')) {
      return 'new2';
    } else return 'new1';
  } else return 'old';
}


const isPrivate = () => {
  let design = getDesign();
  if (design === 'old' || design === 'new1') {
    if (document.querySelector('h3') === null) {
      return false
    } else return true;
  } else if (design === 'new2') {
    if (document.querySelector('private-community-modal') === null) {
      return false;
    } else return true;
  }
}


const start = () => {
  if (!isCommentPage() || !isPrivate()) return;//console.log('not a private comment page');
  console.log('starting redirection');

  let arr = [];
  arr.push(`https://archive.org/wayback/available?url=${window.location.href}`);
  arr.push(`https://archive.org/wayback/available?url=${window.location.href.replace('www', 'old')}`);

  // TODO: 1. check both www and old URLs
  //       2. redirect to newer snapshot between the two
  //       3. if both not available don't redirect and display a message
  Promise.all(arr.map(url =>
    fetch(url).then(resp => resp.json())
  )).then(obj => {
    console.log(obj)
  })

  window.location.href = `https://web.archive.org/web/2/${window.location.href}`;
};


// Entry point
window.onload = _ => start();
