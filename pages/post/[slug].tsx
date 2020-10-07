import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import styles from '../../styles/Home.module.scss';

const { BLOG_URL, CONTENT_API_KEY } = process.env;

async function getPost(slug: string) {
	const res = await fetch(
		`${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}`
		// &fields=title,slug,custom_excerpt,feature_image,url,reading_time`
	).then((res) => res.json());

	const posts = res.posts;

	return posts[0];
}

// Ghost CMS Request
export const getStaticProps = async ({ params }) => {
	const post = await getPost(params.slug);
	return {
		props: { post },
		revalidate: 10,
	};
};

// hello-world - on first request = Ghost CMS call is made (1)
// hello-world - on other requests ... = filesystem is called (1M)

export const getStaticPaths = () => {
	// paths -> slugs which are allowed
	// fallback ->
	return {
		paths: [],
		fallback: true,
	};
};

type Post = {
	title: string;
	html: string;
	slug: string;
	feature_image: string;
	reading_time: number;
	custom_excerpt: string;
};

const Post: React.FC<{ post: Post }> = (props) => {
	console.log(props);

	const { post } = props;
	const [enableLoadComments, setEnableLoadComments] = useState<boolean>(true);

	const router = useRouter();

	if (router.isFallback) {
		return <h1>Loading...</h1>;
	}

	function loadComments() {
		setEnableLoadComments(false);
		(window as any).disqus_config = function () {
			this.page.url = window.location.href;
			this.page.identifier = post.slug;
		};

		const script = document.createElement('script');
		script.src = 'https://ghostcms-nextjs.disqus.com/embed.js';
		script.setAttribute('data-timestamp', Date.now().toString());

		document.body.appendChild(script);
	}

	// This includes setting the noindex header because static files always return
	// a status 200 but the rendered not found page page should obviously not be indexed
	if (!post) {
		return (
			<>
				<Head>
					<meta name='robots' content='noindex' />
				</Head>
				<DefaultErrorPage statusCode={404} />
			</>
		);
	}

	return (
		<div className={styles.container}>
			<p className={styles.goback}>
				<Link href='/'>
					<a>Go back</a>
				</Link>
			</p>
			<h1>{post.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: post.html }}></div>

			{enableLoadComments && (
				<p className={styles.goback} onClick={loadComments}>
					Load Comments
				</p>
			)}

			<div id='disqus_thread'></div>
		</div>
	);
};

export default Post;
