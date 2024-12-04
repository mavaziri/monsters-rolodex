import React, { FC, memo, useState } from 'react';

const CounterButton: React.FC = memo(
  () => {
    const [count, setCount] = useState<number>(0);

    console.log('CounterButton re-rendered');

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison logic here
    // No props in this case, so always return true to skip re-render
    return true;
  }
);

export default CounterButton;
