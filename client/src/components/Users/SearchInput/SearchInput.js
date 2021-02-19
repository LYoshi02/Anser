import React, { useEffect, useRef } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

const SearchInput = ({
  search,
  onChangeSearch,
  onSearchUser,
  onCleanSearch,
}) => {
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
          onChange={onChangeSearch}
        />
        {search.trim().length > 0 && (
          <InputRightElement
            children={<HiX />}
            cursor="pointer"
            onClick={onCleanSearch}
          />
        )}
      </InputGroup>
    </Box>
  );
};

export default SearchInput;
