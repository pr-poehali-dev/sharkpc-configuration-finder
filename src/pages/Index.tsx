import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'
import { toast } from 'sonner'

interface PCComponent {
  id: string
  name: string
  type: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case'
  price: number
  socket?: string
  power?: number
  formFactor?: string
  compatibility?: string[]
}

interface PCBuild {
  id: string
  name: string
  author: string
  likes: number
  components: PCComponent[]
  totalPrice: number
  isCompatible: boolean
}

const sampleComponents: PCComponent[] = [
  { id: 'cpu1', name: 'Intel Core i7-13700K', type: 'cpu', price: 45000, socket: 'LGA1700', power: 125 },
  { id: 'cpu2', name: 'AMD Ryzen 7 7700X', type: 'cpu', price: 42000, socket: 'AM5', power: 105 },
  { id: 'gpu1', name: 'RTX 4070 Super', type: 'gpu', price: 85000, power: 220 },
  { id: 'gpu2', name: 'RTX 4060 Ti', type: 'gpu', price: 65000, power: 165 },
  { id: 'mb1', name: 'ASUS Z790-E', type: 'motherboard', price: 25000, socket: 'LGA1700', formFactor: 'ATX' },
  { id: 'mb2', name: 'MSI B650 Tomahawk', type: 'motherboard', price: 18000, socket: 'AM5', formFactor: 'ATX' },
  { id: 'ram1', name: 'G.Skill 32GB DDR5-5600', type: 'ram', price: 15000 },
  { id: 'storage1', name: 'Samsung 970 EVO Plus 1TB', type: 'storage', price: 12000 },
  { id: 'psu1', name: 'Corsair RM750x', type: 'psu', price: 18000, power: 750 },
  { id: 'case1', name: 'Fractal Design Meshify C', type: 'case', price: 12000, formFactor: 'ATX' }
]

const sampleBuilds: PCBuild[] = [
  {
    id: 'build1',
    name: 'Игровой монстр RTX 4070',
    author: 'GamerPro2024',
    likes: 156,
    components: [sampleComponents[0], sampleComponents[2], sampleComponents[4], sampleComponents[6], sampleComponents[7], sampleComponents[8], sampleComponents[9]],
    totalPrice: 232000,
    isCompatible: true
  },
  {
    id: 'build2', 
    name: 'AMD Beast для стримов',
    author: 'StreamerKing',
    likes: 89,
    components: [sampleComponents[1], sampleComponents[3], sampleComponents[5], sampleComponents[6], sampleComponents[7], sampleComponents[8], sampleComponents[9]],
    totalPrice: 185000,
    isCompatible: true
  }
]

export default function Index() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedComponents, setSelectedComponents] = useState<PCComponent[]>([])
  const [selectedMarketplace, setSelectedMarketplace] = useState('')
  const [isCompatibilityChecking, setIsCompatibilityChecking] = useState(false)
  const [builds, setBuilds] = useState(sampleBuilds)

  const componentTypes = [
    { type: 'cpu', name: 'Процессор', icon: 'Cpu' },
    { type: 'gpu', name: 'Видеокарта', icon: 'Zap' },
    { type: 'motherboard', name: 'Материнская плата', icon: 'CircuitBoard' },
    { type: 'ram', name: 'Оперативная память', icon: 'MemoryStick' },
    { type: 'storage', name: 'Накопитель', icon: 'HardDrive' },
    { type: 'psu', name: 'Блок питания', icon: 'Zap' },
    { type: 'case', name: 'Корпус', icon: 'Box' }
  ]

  const marketplaces = [
    { id: 'ozon', name: 'Ozon', color: 'bg-blue-500' },
    { id: 'wildberries', name: 'Wildberries', color: 'bg-purple-500' },
    { id: 'yandex', name: 'Яндекс Маркет', color: 'bg-yellow-500' },
    { id: 'dns', name: 'DNS', color: 'bg-orange-500' }
  ]

  const addComponent = (component: PCComponent) => {
    setSelectedComponents(prev => {
      const filtered = prev.filter(c => c.type !== component.type)
      return [...filtered, component]
    })
    toast.success(`${component.name} добавлен в сборку`)
  }

  const removeComponent = (componentId: string) => {
    setSelectedComponents(prev => prev.filter(c => c.id !== componentId))
    toast.success('Комплектующее удалено')
  }

  const checkCompatibility = () => {
    setIsCompatibilityChecking(true)
    setTimeout(() => {
      setIsCompatibilityChecking(false)
      
      const cpu = selectedComponents.find(c => c.type === 'cpu')
      const motherboard = selectedComponents.find(c => c.type === 'motherboard')
      const psu = selectedComponents.find(c => c.type === 'psu')
      const gpu = selectedComponents.find(c => c.type === 'gpu')
      const caseComponent = selectedComponents.find(c => c.type === 'case')
      
      let errors = []
      
      if (cpu && motherboard && cpu.socket !== motherboard.socket) {
        errors.push('Процессор не подходит к материнской плате')
      }
      
      if (psu && gpu) {
        const totalPower = (cpu?.power || 0) + (gpu?.power || 0)
        if (psu.power! < totalPower + 100) {
          errors.push('Блок питания слишком слабый для данной конфигурации')
        }
      }
      
      if (motherboard && caseComponent && motherboard.formFactor && caseComponent.formFactor) {
        if (motherboard.formFactor === 'ATX' && caseComponent.formFactor === 'Mini-ITX') {
          errors.push('Материнская плата не помещается в корпус')
        }
      }
      
      if (errors.length === 0) {
        toast.success('✅ Все комплектующие совместимы!')
      } else {
        toast.error(`❌ Обнаружены проблемы: ${errors.join(', ')}`)
      }
    }, 1500)
  }

  const likeBuild = (buildId: string) => {
    setBuilds(prev => 
      prev.map(build => 
        build.id === buildId ? { ...build, likes: build.likes + 1 } : build
      )
    )
  }

  const totalPrice = selectedComponents.reduce((sum, component) => sum + component.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-gaming-darker to-black">
      {/* Header */}
      <header className="bg-gaming-dark/80 backdrop-blur-md border-b border-gaming-purple/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-gaming-purple to-gaming-purple-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🦈</span>
              </div>
              <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-white to-gaming-purple-light bg-clip-text text-transparent">
                SharkPC
              </h1>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-gaming-darker border-gaming-purple/20">
                <TabsTrigger value="home" className="text-white data-[state=active]:bg-gaming-purple">
                  Главная
                </TabsTrigger>
                <TabsTrigger value="configurator" className="text-white data-[state=active]:bg-gaming-purple">
                  Конфигуратор
                </TabsTrigger>
                <TabsTrigger value="builds" className="text-white data-[state=active]:bg-gaming-purple">
                  Сборки
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Home Tab */}
          <TabsContent value="home" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gaming-purple via-gaming-purple-light to-gaming-cyan p-12 text-center">
              <div className="relative z-10">
                <h2 className="text-5xl font-orbitron font-black text-white mb-4">
                  Создай компьютер мечты
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Подбери идеальную конфигурацию ПК с проверкой совместимости и поиском по всем маркетплейсам России
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setActiveTab('configurator')}
                  className="bg-white text-gaming-purple hover:bg-white/90 font-bold text-lg px-8 py-3"
                >
                  Начать сборку <Icon name="ArrowRight" className="ml-2" />
                </Button>
              </div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gaming-dark border-gaming-purple/20 text-white">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gaming-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Zap" size={32} className="text-white" />
                  </div>
                  <CardTitle className="font-orbitron">Проверка совместимости</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-300">
                    Автоматическая проверка совместимости всех комплектующих с детальными рекомендациями
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gaming-dark border-gaming-purple/20 text-white">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gaming-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={32} className="text-white" />
                  </div>
                  <CardTitle className="font-orbitron">Поиск по маркетплейсам</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-300">
                    Поиск лучших цен на Ozon, Wildberries, Яндекс Маркет и DNS с рейтингами и отзывами
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gaming-dark border-gaming-purple/20 text-white">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gaming-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" size={32} className="text-white" />
                  </div>
                  <CardTitle className="font-orbitron">Сообщество сборок</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-300">
                    Делитесь своими сборками, ставьте лайки и выводите лучшие конфигурации в топ
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurator Tab */}
          <TabsContent value="configurator" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-orbitron font-bold text-white">Конфигуратор ПК</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-gaming-purple-light">
                  {totalPrice.toLocaleString()} ₽
                </div>
                <div className="text-sm text-gray-400">Общая стоимость</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Component Selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Выберите комплектующие</h3>
                {componentTypes.map((componentType) => (
                  <Card key={componentType.type} className="bg-gaming-dark border-gaming-purple/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon name={componentType.icon as any} className="text-gaming-purple-light" />
                          <CardTitle className="text-white">{componentType.name}</CardTitle>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-gaming-purple-light border-gaming-purple/30">
                              Выбрать
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gaming-dark border-gaming-purple/20 text-white max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-orbitron">Выберите {componentType.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex space-x-4">
                                <Input placeholder="Поиск..." className="bg-gaming-darker border-gaming-purple/30" />
                                <Select>
                                  <SelectTrigger className="w-48 bg-gaming-darker border-gaming-purple/30">
                                    <SelectValue placeholder="Фильтр" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="price">По цене</SelectItem>
                                    <SelectItem value="rating">По рейтингу</SelectItem>
                                    <SelectItem value="name">По названию</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="max-h-96 overflow-y-auto space-y-2">
                                {sampleComponents
                                  .filter(c => c.type === componentType.type)
                                  .map(component => (
                                    <div
                                      key={component.id}
                                      className="flex items-center justify-between p-4 bg-gaming-darker rounded-lg border border-gaming-purple/10 hover:border-gaming-purple/30 cursor-pointer"
                                      onClick={() => addComponent(component)}
                                    >
                                      <div>
                                        <h4 className="font-semibold">{component.name}</h4>
                                        <p className="text-sm text-gray-400">
                                          {component.socket && `Сокет: ${component.socket} • `}
                                          {component.power && `${component.power}W • `}
                                          {component.formFactor && `${component.formFactor}`}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-lg font-bold text-gaming-purple-light">
                                          {component.price.toLocaleString()} ₽
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    {selectedComponents.find(c => c.type === componentType.type) && (
                      <CardContent className="pt-0">
                        {(() => {
                          const component = selectedComponents.find(c => c.type === componentType.type)!
                          return (
                            <div className="flex items-center justify-between p-3 bg-gaming-darker rounded-lg">
                              <div>
                                <div className="font-semibold text-white">{component.name}</div>
                                <div className="text-sm text-gray-400">
                                  {component.price.toLocaleString()} ₽
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeComponent(component.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Icon name="X" size={16} />
                              </Button>
                            </div>
                          )
                        })()}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* Actions and Summary */}
              <div className="space-y-6">
                <Card className="bg-gaming-dark border-gaming-purple/20">
                  <CardHeader>
                    <CardTitle className="text-white font-orbitron">Действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={checkCompatibility}
                      disabled={selectedComponents.length < 2 || isCompatibilityChecking}
                      className="w-full bg-gaming-purple hover:bg-gaming-purple-dark"
                    >
                      {isCompatibilityChecking ? (
                        <>
                          <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                          Проверяю совместимость...
                        </>
                      ) : (
                        <>
                          <Icon name="CheckCircle" className="mr-2" />
                          Проверить совместимость
                        </>
                      )}
                    </Button>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Маркетплейс для поиска:</label>
                      <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                        <SelectTrigger className="bg-gaming-darker border-gaming-purple/30">
                          <SelectValue placeholder="Выберите маркетплейс" />
                        </SelectTrigger>
                        <SelectContent>
                          {marketplaces.map(marketplace => (
                            <SelectItem key={marketplace.id} value={marketplace.id}>
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${marketplace.color}`}></div>
                                <span>{marketplace.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      disabled={selectedComponents.length === 0 || !selectedMarketplace}
                      className="w-full bg-gaming-cyan hover:bg-gaming-cyan/80 text-white"
                    >
                      <Icon name="Search" className="mr-2" />
                      Найти ПК на {marketplaces.find(m => m.id === selectedMarketplace)?.name}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gaming-dark border-gaming-purple/20">
                  <CardHeader>
                    <CardTitle className="text-white font-orbitron">Текущая сборка</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedComponents.length === 0 ? (
                      <p className="text-gray-400">Выберите комплектующие для начала сборки</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedComponents.map(component => (
                          <div key={component.id} className="flex justify-between items-center">
                            <span className="text-white text-sm">{component.name}</span>
                            <span className="text-gaming-purple-light font-semibold">
                              {component.price.toLocaleString()} ₽
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-gaming-purple/20 pt-2 mt-2">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-white">Итого:</span>
                            <span className="text-gaming-purple-light text-lg">
                              {totalPrice.toLocaleString()} ₽
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Builds Tab */}
          <TabsContent value="builds" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-orbitron font-bold text-white">Сборки сообщества</h2>
              <Button className="bg-gaming-purple hover:bg-gaming-purple-dark">
                <Icon name="Plus" className="mr-2" />
                Добавить сборку
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {builds
                .sort((a, b) => b.likes - a.likes)
                .map((build) => (
                  <Card key={build.id} className="bg-gaming-dark border-gaming-purple/20">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white font-orbitron">{build.name}</CardTitle>
                          <p className="text-gray-400 text-sm">by {build.author}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => likeBuild(build.id)}
                            className="text-gaming-purple-light hover:bg-gaming-purple/20"
                          >
                            <Icon name="Heart" className="mr-1" size={16} />
                            {build.likes}
                          </Button>
                          <Badge variant={build.isCompatible ? "default" : "destructive"}>
                            {build.isCompatible ? "✅ Совместимо" : "❌ Проблемы"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {build.components.slice(0, 4).map(component => (
                          <div key={component.id} className="flex justify-between text-sm">
                            <span className="text-gray-300">{component.name}</span>
                            <span className="text-gaming-purple-light">
                              {component.price.toLocaleString()} ₽
                            </span>
                          </div>
                        ))}
                        {build.components.length > 4 && (
                          <div className="text-sm text-gray-400">
                            +{build.components.length - 4} других комплектующих
                          </div>
                        )}
                        <div className="border-t border-gaming-purple/20 pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-white">Общая стоимость:</span>
                            <span className="text-gaming-purple-light">
                              {build.totalPrice.toLocaleString()} ₽
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}