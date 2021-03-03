import React, { useEffect, useRef, useState } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

const SearchInput = ({ onSearchUser }) => {
  const [search, setSearch] = useState("");
  const searchRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === searchRef.current.value) {
        const searchTrimmed = search.trim();
        const query =
          searchTrimmed.length === 0 ? "" : `?search=${searchTrimmed}`;
        onSearchUser(query);
      }
    }, [500]);

    return () => clearTimeout(timer);
  }, [search, searchRef, onSearchUser]);

  return (
    <Box p="2">
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<HiSearch />} />
        <Input
          type="text"
          placeholder="Buscar usuario"
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search.trim().length > 0 && (
          <InputRightElement
            children={<HiX />}
            cursor="pointer"
            zIndex="0"
            onClick={() => setSearch("")}
          />
        )}
      </InputGroup>
    </Box>
  );
};

export default SearchInput;
