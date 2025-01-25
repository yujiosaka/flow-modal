const refreshModal = (force: boolean) => () => {
  const modal = document.querySelector('flow-modal');
  modal!.refreshState(force);
};

const primary = document.querySelector('.control__button--primary');
primary!.addEventListener('click', refreshModal(true));

const secondary = document.querySelector('.control__button--secondary');
secondary!.addEventListener('click', refreshModal(false));
