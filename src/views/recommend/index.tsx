import Album from '@/components/album'
import Card from '@/components/card'
import Carousel from '@/components/carousel'
import Loading from '@/components/loading'
import React from 'react'
import { Banner, BannerList } from '@/components/carousel/type'
import { CardItem, RecommendContainer } from './style'
import { getBannerList } from '@/service'
import { getTopPlaylist } from '@/service/playlist'
import { isSuccessResponse } from '@/utils/is'
import { PlayList } from './types'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Recommend() {
  const [bannerList, setBannerList] = useState<Array<Banner>>([])
  const [playlists, setPlaylists] = useState<Array<PlayList>>([])
  const [loadingVisible, setLoadingVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getBannerList().then(res => {
      const data = res.parseBody as BannerList
      if (!isSuccessResponse(data)) {
        console.log('error')
      }
      setBannerList(data.banners)
    })

    getTopPlaylist()
      .then(res => {
        const data = res.parseBody as any
        if (!isSuccessResponse(data)) {
          console.log('error')
        }
        setPlaylists(data.playlists)
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
  }, [playlists, bannerList])

  const goPlaylist = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`, { replace: false })
  }

  return (
    <RecommendContainer>
      <Carousel banners={bannerList} />
      <Card title="推荐歌单">
        <CardItem>
          {playlists.map(item => (
            <Album
              key={item.id}
              img={item.coverImgUrl}
              title={item.name}
              onClick={() => goPlaylist(item.id)}
            />
          ))}
        </CardItem>
      </Card>
      <Loading visible={loadingVisible} />
    </RecommendContainer>
  )
}

export default React.memo(Recommend)
