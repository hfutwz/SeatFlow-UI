import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Spin, Tag, Button, Descriptions } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { roomApi } from '../../services/room'
import type { RoomDetail } from '../../services/room'
import SeatMap from '../../components/SeatMap/SeatMap'

const { Title, Text } = Typography

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<RoomDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchDetail = async () => {
      try {
        const res = await roomApi.getDetail(Number(id))
        if (res.data.code === 200) {
          setRoom(res.data.data)
        }
      } catch (error) {
        console.error('获取自习室详情失败', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>
  if (!room) return <div>自习室不存在</div>

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/student/rooms')} style={{ marginBottom: 16 }}>
        返回列表
      </Button>

      <Title level={3}>{room.name}</Title>

      <Descriptions bordered size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="位置">{room.location || '未设置'}</Descriptions.Item>
        <Descriptions.Item label="开放时间">{room.openTime?.slice(0,5)} - {room.closeTime?.slice(0,5)}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={room.status === 'OPEN' ? 'green' : 'red'}>
            {room.status === 'OPEN' ? '开放' : '关闭'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="空座">
          <Text type={room.availableSeats > 0 ? 'success' : 'danger'}>
            {room.availableSeats}/{room.totalSeats}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="院系">{room.departmentName}</Descriptions.Item>
      </Descriptions>

      <Title level={5}>座位图</Title>
      <div style={{ 
        background: '#fafafa', 
        padding: 24, 
        borderRadius: 8,
        overflow: 'auto'
      }}>
        <SeatMap 
          seats={room.seats} 
          maxRow={room.maxRow} 
          maxCol={room.maxCol}
          onSeatClick={(seat) => {
            // M3 will implement reservation from here
            console.log('Seat clicked:', seat)
          }}
        />
      </div>
    </div>
  )
}

export default RoomDetail
