import Album from '@/components/album'
import Card from '@/components/card'
import Carousel from '@/components/carousel'
import Loading from '@/components/loading'
import React from 'react'
import { Banner } from '@/components/carousel/type'
import { CardItem, RecommendContainer } from './style'
import { getBannerList } from '@/service'
import { getPersonalized } from '@/service/playlist'
import { isSuccessResponse } from '@/utils/is'
import { PlayList } from './types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Scroll from '@/components/scroll'
import { forceCheck } from 'react-lazyload'

function Recommend() {
  const [bannerList, setBannerList] = useState<Array<Banner>>([])
  const [playlists, setPlaylists] = useState<Array<PlayList>>([])
  const [loadingVisible, setLoadingVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getBannerList()
      .then((res: any) => {
        if (!isSuccessResponse(res)) {
          return
        }
        setBannerList(res.banners)
      })
      .catch(err => {
        console.log(err)
      })

    getPersonalized()
      .then((res: any) => {
        if (!isSuccessResponse(res)) {
          return
        }
        setPlaylists(res.result)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  // 监听数据是否加载完成，显示loading
  useEffect(() => {
    if (!playlists.length) {
      setLoadingVisible(true)
    } else {
      setLoadingVisible(false)
    }
  }, [playlists])

  const goPlaylist = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`, { replace: false })
  }

  return (
    <RecommendContainer>
      <Scroll onScroll={forceCheck}>
        <Carousel banners={bannerList} />
        <Card title="推荐歌单">
          <CardItem>
            {playlists.map(item => (
              <Album
                key={item.id}
                img={item.picUrl}
                title={item.name}
                count={item.playCount}
                onClick={() => goPlaylist(item.id)}
              />
            ))}
          </CardItem>
        </Card>
        <Loading visible={loadingVisible} />
      </Scroll>
    </RecommendContainer>
  )
}

export default React.memo(Recommend)
