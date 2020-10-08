import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';
import styles from '../styles/Home.module.scss';

const { BLOG_URL, CONTENT_API_KEY } = process.env;

type Post = {
	title: string;
	slug: string;
	feature_image: string;
	published_at: string;
};

async function getPosts() {
	// curl ""

	const resTest = await fetch(
		`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}`
	).then((res) => res.json());
	console.log('resTest ', resTest);

	const res = await fetch(
		`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt,feature_image,url,reading_time,published_at`
	).then((res) => res.json());

	const posts = res.posts;
	console.log('posts ', posts);

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
			<h1 className='main-title'>Welcome to the blog</h1>
			<div className={styles.content}>
				{posts.map((post, index) => {
					const postImage = post.feature_image || '/fallback-image.jpg';
					return (
						<div className={styles.postitem} key={post.slug}>
							<div className='card__image-holder'>
								<Link href='/post/[slug]' as={`/post/${post.slug}`}>
									<img className='card__image' src={postImage} alt='wave' />
								</Link>
							</div>
							<div className='card-title'>
								<Link href='/post/[slug]' as={`/post/${post.slug}`}>
									<a>{post.title}</a>
								</Link>
								<p>
									<strong>Post Date: </strong>
									{moment(post.published_at).format('YYYY-MM-DD')}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Home;
