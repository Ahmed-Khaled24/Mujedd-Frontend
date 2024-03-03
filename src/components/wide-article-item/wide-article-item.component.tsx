import defaultUserImage from '../../assets/imgs/user.jpg';
import { ReceivedArticle } from '../../types/article';
import Tag from '../tag/tag.component';
import {
    ArticleContainer,
    ArticleContentContainer,
    ArticleFooter,
    ArticleThumbnail,
    AuthorData,
    AuthorPicture,
} from './wide-article-item.styles';

type WideArticleItemProps = ReceivedArticle & {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const WideArticleItem = ({
    author,
    coverImageUrl,
    tags,
    title,
    updatedAt,
    onClick,
}: WideArticleItemProps) => {
    return (
        <ArticleContainer onClick={onClick}>
            <ArticleContentContainer>
                <AuthorData>
                    <AuthorPicture
                        src={author?.image ?? defaultUserImage}
                        alt="user profile picture"
                    />
                    {author?.fullName}
                    <span className="text-xs opacity-50"> • </span>
                    <span className="text-xs opacity-70">
                        {new Date(updatedAt).toDateString()}
                    </span>
                </AuthorData>

                <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-black text-slate-700">
                            {title}
                        </h1>
                        <ArticleFooter>
                            {tags
                                ?.slice(0, 3)
                                .map((tag) => <Tag text={tag} size="xs" />)}
                        </ArticleFooter>
                    </div>
                    <ArticleThumbnail src={coverImageUrl} alt={'thumbnail'} />
                </div>
            </ArticleContentContainer>
        </ArticleContainer>
    );
};

export default WideArticleItem;