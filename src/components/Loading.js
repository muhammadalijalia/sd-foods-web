import { useTranslation } from 'react-i18next'

const Loading = () => {
    const { t } = useTranslation();
    return (
        <div className="d-flex align-items-center">
            <strong>{t('Loading...')}</strong>
            <div className="spinner-border ml-auto" role="status" aria-hidden="true"></div>
        </div>
    );
}

export default Loading;