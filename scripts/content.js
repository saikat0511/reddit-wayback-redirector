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


let urlArr = [];
urlArr.push(`https://archive.org/wayback/available?url=${window.location.href}`);
urlArr.push(`https://archive.org/wayback/available?url=${window.location.href.replace('www', 'old')}`);

// TODO: 1. (DONE) check both www and old URLs
//       2. (DONE) redirect to newer snapshot between the two
//       3. if both not available display a message
Promise.all(urlArr.map(url =>
  fetch(url).then(resp => resp.json())
)).then(objects => {
  let latestTimestamp = 0;
  let latestURL = '';
  objects.forEach(obj => {
    if (Object.keys(obj.archived_snapshots).length !== 0) {
      if (obj.archived_snapshots.closest.timestamp > latestTimestamp) {
        latestTimestamp = obj.archived_snapshots.closest.timestamp;
        latestURL = obj.archived_snapshots.closest.url;
      }
    }
  });

  window.onload = () => {
    // don't redirect if the subreddit isn't private OR a comment page
    if (!isCommentPage() || !isPrivate()) return;

    // dont redirect if page not available on wayback machine
    if (latestURL === '') return;
    window.location.href = latestURL;
  };
});
