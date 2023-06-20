const getSubName = () => {
  let urlArr = window.location.href.split('/');
  let subName = `${urlArr[3]}/${urlArr[4]}`;
  return subName;
}


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
  console.log(design);
  if (design === 'old') {
    if (document.querySelector('.interstitial') === null) {
      return false
    } else return true;
  } else if (design === 'new1') {
    if (document.querySelector('h3') === null) {
      return false
    } else return true;
  } else if (design === 'new2') {
    if (document.querySelector('private-community-modal') === null) {
      return false;
    } else return true;
  }
}


const insertRedirectBanner = () => {
  let backdrop = document.createElement('div');
  backdrop.className = 'backdrop';
  backdrop.innerHTML = `
    <div class="redirectDialog">
      <div class="bannerHeading"></div>
      <div class="bannerSubHeading"></div>
    </div
  `;
  document.body.prepend(backdrop);
}


const showBannerMessage = (heading, subHeading) => {
  let bannerHeading = document.querySelector('.bannerHeading');
  let bannerSubHeading = document.querySelector('.bannerSubHeading');
  bannerHeading.textContent = heading;
  bannerSubHeading.textContent = subHeading;
  document.querySelector('.backdrop').classList.add('backdropShow');
}
