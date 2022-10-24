export const halt = (duration = 0) =>
  new Promise(r => {
    setTimeout(r, duration); // 要等才會過 why?
  });
