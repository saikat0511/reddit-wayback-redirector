let urlList = [
  `https://archive.org/wayback/available?url=${window.location.href}`,
  `https://archive.org/wayback/available?url=${window.location.href.replace('www', 'old')}`
];
let fetches = urlList.map(url => fetch(url).then(res => res.json()));
let rejected = false;
let data = [];
let latestTimestamp = 0;
let latestURL = '';

// fetch wayback API for latest available snapshot between default and old website
Promise.allSettled(fetches)
  .then(results => {
    results.forEach(result => {
      if (result.status !== 'fulfilled') {
        rejected = true;
        return;
      }
      if (
        Object.keys(result.value.archived_snapshots).length !== 0 &&
        result.value.archived_snapshots.closest.timestamp > latestTimestamp) {
        latestTimestamp = result.value.archived_snapshots.closest.timestamp;
        latestURL = result.value.archived_snapshots.closest.url;
      }
    })
  })

// insert backdrop element (initially invisible) as soon as body becomes available
const bodyObserver = new MutationObserver((mutations, mutationInstance) => {
  let target = document.body;
  if (target) {
    insertRedirectBanner();
    mutationInstance.disconnect();
  };
});
bodyObserver.observe(document.documentElement, { attributes: true, childList: true, subtree: true });


window.onload = () => {
  // don't redirect if the subreddit isn't private
  if (!isCommentPage() || !isPrivate()) return;

  // show message if fetch rejected
  if (rejected) {
    showBannerMessage(
      `Wayback Machine seems to be unreachable...`,
      'You can retry by reloading the page'
    );
    return;
  }

  // dont redirect if page not available on wayback machine
  if (latestURL === '') {
    showBannerMessage(
      `${getSubName()} is private`,
      'There seems to be no available wayback snapshot :('
    );
  } else {
    showBannerMessage(
      `${getSubName()} is private`,
      'Redirecting you to Wayback Machine...'
    );
    window.location.replace(latestURL);
  }
};
