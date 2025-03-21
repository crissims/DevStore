import { api } from "@/data/api";
import { Product } from "@/data/types/product";
import { Metadata } from "next";
import Image from "next/image";

interface ProductProps {
    params: Promise<{
        slug: string;
    }>;
}








async function getProduct(slug: string): Promise<Product> {
    const response = await api(`/products/${slug}`, {
        next: {
            revalidate: 60 * 60,
        }
    });

    const products = await response.json();

    return products
}

export async function generateMetadata(props: ProductProps): Promise<Metadata> {
    const params = await props.params;
    const product = await getProduct(params.slug)
    return {
        title: product.title,
    }
}



export async function generateStaticParams(props: ProductProps) {
    const response = await api('/products/featured');
    const products: Product[] = await response.json();

    return products.map((product) => {
        return {
            slug: product.slug,
        };
    });
}



export default async function ProductPage(props: ProductProps) {
    const params = await props.params;
    const product = await getProduct(params.slug)

    return (
        <div className="relative grid max-h-[860px] grid-cols-3">
            <div className="col-span-2 overflow-hidden">
                <Image
                    src={product.image}
                    alt="Never Stop Learning"
                    width={1000}
                    height={1000}
                    quality={100} />
            </div>

            <div className="flex flex-col justify-center px-12 ">
                <h1 className="text-3xl font-bold leanding-tight ">
                    {product.title}
                </h1>

                <p className="mt-2 leanding-relaxed text-zinc-400">
                    {product.description}
                </p>

                <div className="mt-8 flex items-center gap-3">
                    <span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 font-semibold">
                        {product.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </span>
                    <span className="text-sm text-zinc-400">
                        {(product.price / 12).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',

                        })}
                    </span>
                </div>

                <div className="mt-8 space-y-4">
                    <span className="block font-semibold">Tamanhos</span>

                    <div className="flex gap-2">
                        <button type="button" className="flex h-9 w-14 items-center justify-center rounded-full border  border-zinc-700 bg-zinc-800 text-sm font-semibold"
                        >
                            P
                        </button>

                        <button type="button" className="flex h-9 w-14 items-center justify-center rounded-full border  border-zinc-700 bg-zinc-800 text-sm font-semibold"
                        >
                            M
                        </button>

                        <button type="button" className="flex h-9 w-14 items-center justify-center rounded-full border  border-zinc-700 bg-zinc-800 text-sm font-semibold"
                        >
                            G
                        </button>

                        <button type="button" className="flex h-9 w-14 items-center justify-center rounded-full border  border-zinc-700 bg-zinc-800 text-sm font-semibold"
                        >
                            GG
                        </button>
                    </div>
                </div>

                <button type="button" className="mt-8 flex h-12 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">Adcionar ao carrinho</button>
            </div>
        </div>

    )
}