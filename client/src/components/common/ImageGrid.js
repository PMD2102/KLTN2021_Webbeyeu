import React from "react";
import { Grid, GridItem, HStack, Image, Text } from "@chakra-ui/react";

const ImageGrid = ({ images }) => {
  let imageRender = null;
  switch (images.length) {
    case 0:
      ImageGrid = null;
      break;

    case 1:
      imageRender = (
        <Image
          h="25em"
          w="100%"
          objectFit="cover"
          src={images[0]}
          alt="image"
        />
      );
      break;

    case 2:
      imageRender = (
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          <Image boxSize="25em" objectFit="cover" src={images[0]} alt="image" />
          <Image boxSize="25em" objectFit="fit" src={images[1]} alt="image" />
        </Grid>
      );
      break;

    case 3:
      imageRender = (
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          <GridItem colSpan={2}>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[0]}
              alt="image"
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[1]}
              alt="image"
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[2]}
              alt="image"
            />
          </GridItem>
        </Grid>
      );
      break;

    case 4:
      imageRender = (
        <Grid
          templateColumns="repeat(2, 1fr)"
          templateRows="repeat(2, 1fr)"
          gap={2}
        >
          <GridItem>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[0]}
              alt="image"
            />
          </GridItem>
          <GridItem rowSpan={1}>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[1]}
              alt="image"
            />
          </GridItem>
          <GridItem rowSpan={1}>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[2]}
              alt="image"
            />
          </GridItem>
          <GridItem rowSpan={1}>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[3]}
              alt="image"
            />
          </GridItem>
        </Grid>
      );
      break;

    default:
      imageRender = (
        <Grid
          templateColumns="repeat(2, 1fr)"
          templateRows="repeat(2, 1fr)"
          gap={2}
        >
          <GridItem>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[0]}
              alt="image"
            />
          </GridItem>
          <GridItem rowSpan={1}>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[1]}
              alt="image"
            />
          </GridItem>
          <GridItem rowSpan={1}>
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[2]}
              alt="image"
            />
          </GridItem>
          <GridItem rowSpan={1} pos="relative">
            <Image
              h="25em"
              w="100%"
              objectFit="cover"
              src={images[3]}
              alt="image"
            />
            <HStack
              pos="absolute"
              top="0"
              right="0"
              bottom="0"
              left="0"
              bgColor="rgba(0,0,0,0.5)"
              align="center"
              justify="center"
            >
              <Text fontSize="4xl" color="white">
                +1
              </Text>
            </HStack>
          </GridItem>
        </Grid>
      );
      break;
  }

  return imageRender;
};

export default ImageGrid;
