import React from "react";

interface ListProps<T> {
  items: T[];
  component: React.ComponentType<T>;
}


export function List<T>({ items, component: Component }: ListProps<T>) {
  return (
    <>
      {items.map((item, index) => (
        <Component key={index} {...item} />
      ))}
    </>
  );
}

