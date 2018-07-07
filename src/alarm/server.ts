 callLogger = (count: number) => {
  return setTimeout(() => {
    console.log(`This is still TODO. Iteration ${count}`);
    return count < 20 ? callLogger(count + 1) : count;
  }, 500);
}

callLogger(0);
