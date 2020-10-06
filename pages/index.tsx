import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.scss';

const { BLOG_URL, CONTENT_API_KEY } = process.env;

type Post = {
	title: string;
	slug: string;
	feature_image: string;
};

async function getPosts() {
	// curl ""

	const resTest = await fetch(
		`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}`
	).then((res) => res.json());
	console.log('resTest ', resTest);

	const res = await fetch(
		`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt,feature_image,url,reading_time`
	).then((res) => res.json());

	const posts = res.posts;

	return posts;
}

export const getStaticProps = async ({ params }) => {
	const posts = await getPosts();
	return {
		props: { posts },
	};
};

const Home: React.FC<{ posts: Post[] }> = (props) => {
	const { posts } = props;

	return (
		<div className={styles.container}>
			<h1>Welcome to the blog</h1>
			{posts.map((post, index) => {
				return (
					<div className={styles.postitem} key={post.slug}>
						<div className='card__image-holder'>
							<img
								className='card__image'
								src={post.feature_image}
								alt='wave'
							/>
						</div>
						<div className='card-title'>
							<Link href='/post/[slug]' as={`/post/${post.slug}`}>
								<a>{post.title}</a>
							</Link>
						</div>
						{/* <Link href='/post/[slug]' as={`/post/${post.slug}`}>
							<a>{post.title}</a>
						</Link> */}
					</div>
				);
			})}
		</div>
	);
};

export default Home;

{
	/* <div class="card">
<div class="card__image-holder">
	<img class="card__image" src={post.feature_image} alt="wave" />
</div>
<div class="card-title">
<Link href='/post/[slug]' as={`/post/${post.slug}`}>
							<a>{post.title}</a>
						</Link>
</div>
</div> */
}
