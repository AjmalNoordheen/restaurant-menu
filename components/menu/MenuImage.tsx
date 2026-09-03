import Image, { type ImageProps } from "next/image";

export type MenuImageProps = Omit<ImageProps, "alt" | "src"> & {
  alt: string;
  src: ImageProps["src"];
};

export default function MenuImage({
  alt,
  src,
  ...props
}: MenuImageProps) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized
    />
  );
}
