import Image from "next/image";
import Link from "next/link";

export function CollectionCard({
  name,
  slug,
  cover,
}: {
  name: string;
  slug: string;
  cover: { url: string; alt: string };
}) {
  return (
    <Link href={`/shop?collection=${slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-baseline justify-between gap-3 px-1 pt-2 text-ui uppercase">
        <h3 className="font-medium underline-offset-4 group-hover:underline">{name}</h3>
        <span className="text-muted">Shop</span>
      </div>
    </Link>
  );
}
