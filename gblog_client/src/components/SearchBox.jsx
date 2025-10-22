import React from "react";
import { Input } from "./ui/input";

const SearchBox = () => {
  return (
    <form>
      <Input
        placeholder="search here..."
        className="h-10 rounded-full bg-gray-100 "
      ></Input>
    </form>
  );
};

export default SearchBox;
