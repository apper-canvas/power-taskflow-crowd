import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast, addDays } from 'date-fns'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'personal',
    status: 'todo'
  })

  })
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [viewMode, setViewMode] = useState('list')


  const categories = [
    { id: 'personal', name: 'Personal', color: 'bg-blue-500', icon: 'User' },
    { id: 'work', name: 'Work', color: 'bg-purple-500', icon: 'Briefcase' },
    { id: 'health', name: 'Health', color: 'bg-green-500', icon: 'Heart' },
    { id: 'learning', name: 'Learning', color: 'bg-yellow-500', icon: 'BookOpen' },
    { id: 'shopping', name: 'Shopping', color: 'bg-pink-500', icon: 'ShoppingCart' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 'high', label: 'High', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' }
  ]

  const taskStatuses = [
    { value: 'todo', label: 'To Do', color: 'bg-surface-100 dark:bg-surface-700' },
    { value: 'inprogress', label: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'done', label: 'Done', color: 'bg-green-100 dark:bg-green-900/30' }
  ]


  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Initialize with sample tasks for demo
      const sampleTasks = [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Finish the quarterly project proposal for client review',
          dueDate: format(new Date(), 'yyyy-MM-dd'),
          priority: 'high',
          status: 'inprogress',

          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Morning workout',
          description: '30 minutes cardio and strength training',
          dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
          priority: 'medium',
          category: 'health',
          status: 'done',

        }
      ]
      setTasks(sampleTasks)
      localStorage.setItem('taskflow-tasks', JSON.stringify(sampleTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...newTask, updatedAt: new Date().toISOString() }
          : task
      ))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      const task = {
        id: Date.now().toString(),
        ...newTask,
        status: 'todo',

      }
      setTasks([task, ...tasks])
      toast.success('Task created successfully!')
    }

    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', category: 'personal', status: 'todo' })

    setShowForm(false)
  }

  const handleEdit = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      status: task.status
    })

    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    let newStatus
    
    if (task.status === 'todo') newStatus = 'inprogress'
    else if (task.status === 'inprogress') newStatus = 'done'
    else newStatus = 'todo'
    
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
        : t
    ))
    
    const statusLabels = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }
    toast.success(`Task moved to ${statusLabels[newStatus]}!`)
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const newStatus = destination.droppableId
    
    setTasks(tasks.map(task => 
      task.id === draggableId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ))
    
    const statusLabels = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }
    toast.success(`Task moved to ${statusLabels[newStatus]}!`)
  }


  const getFilteredTasks = () => {
    let filtered = tasks

    if (filter !== 'all') {
      filtered = filtered.filter(task => {
          case 'completed':
            return task.status === 'done'
          case 'pending':
            return task.status === 'todo' || task.status === 'inprogress'
          case 'today':
            return task.dueDate === format(new Date(), 'yyyy-MM-dd')
          case 'overdue':
            return isPast(new Date(task.dueDate)) && task.status !== 'done'
          default:
            return task.category === filter
        }
      })
    }

    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      if (a.status !== b.status) {
        const statusOrder = { todo: 0, inprogress: 1, done: 2 }
        return statusOrder[a.status] - statusOrder[b.status]
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.status === 'done').length
    const pending = tasks.filter(task => task.status === 'todo' || task.status === 'inprogress').length
    const overdue = tasks.filter(task => isPast(new Date(task.dueDate)) && task.status !== 'done').length
    return { total, completed, pending, overdue }
  }


  const stats = getTaskStats()
  const filteredTasks = getFilteredTasks()

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="py-8 md:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          {[
            { label: 'Total Tasks', value: stats.total, icon: 'List', color: 'from-blue-500 to-blue-600' },
            { label: 'Completed', value: stats.completed, icon: 'CheckCircle', color: 'from-green-500 to-green-600' },
            { label: 'Pending', value: stats.pending, icon: 'Clock', color: 'from-yellow-500 to-yellow-600' },
            { label: 'Overdue', value: stats.overdue, icon: 'AlertCircle', color: 'from-red-500 to-red-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="p-4 md:p-6 rounded-2xl bg-white/80 dark:bg-surface-800/80 glass border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-surface-600 dark:text-surface-400 font-medium">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-card`}>
                  <ApperIcon name={stat.icon} className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Task Management Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/90 dark:bg-surface-800/90 glass rounded-3xl border border-surface-200 dark:border-surface-700 p-4 md:p-8 shadow-soft"
        >
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <motion.button
                onClick={() => setShowForm(!showForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-glow hover:shadow-xl transition-all duration-200"
              >
                <ApperIcon name="Plus" className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">{editingTask ? 'Update Task' : 'Add Task'}</span>
              </motion.button>

              <div className="flex bg-surface-100 dark:bg-surface-700 rounded-xl p-1">
                {['list', 'grid', 'kanban'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 capitalize ${
                      viewMode === mode
                        ? 'bg-white dark:bg-surface-600 text-primary-600 dark:text-primary-400 shadow-card'
                        : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                    }`}
                  >
                    <ApperIcon name={mode === 'list' ? 'List' : mode === 'grid' ? 'Grid3X3' : 'Columns'} className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                ))}
              </div>

            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 md:py-3 w-full sm:w-64 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 md:py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="today">Due Today</option>
                <option value="overdue">Overdue</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Task Form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="mb-6 md:mb-8 p-4 md:p-6 bg-surface-50 dark:bg-surface-700/50 rounded-2xl border border-surface-200 dark:border-surface-600"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Enter task title..."
                      className="w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Enter task description..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    >
                      {taskStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>

                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-glow hover:shadow-xl transition-all duration-200"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingTask(null)
                      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', category: 'personal', status: 'todo' })

                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-300 dark:hover:bg-surface-500 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Tasks Display */}
          {/* Tasks Display */}
          {viewMode === 'kanban' ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {taskStatuses.map(status => {
                  const statusTasks = filteredTasks.filter(task => task.status === status.value)
                  
                  return (
                    <div key={status.value} className="flex flex-col">
                      <div className="flex items-center justify-between mb-4 p-3 bg-surface-50 dark:bg-surface-700 rounded-xl">
                        <h3 className="font-semibold text-surface-900 dark:text-surface-100">{status.label}</h3>
                        <span className="text-sm text-surface-500 dark:text-surface-400 bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
                          {statusTasks.length}
                        </span>
                      </div>
                      
                      <Droppable droppableId={status.value}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 space-y-3 p-2 rounded-xl transition-all duration-200 min-h-[200px] ${
                              snapshot.isDraggingOver ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-600' : 'bg-transparent'
                            }`}
                          >
                            {statusTasks.map((task, index) => {
                              const category = categories.find(cat => cat.id === task.category)
                              const priority = priorities.find(p => p.value === task.priority)
                              const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'done'
                              const isDueToday = isToday(new Date(task.dueDate))

                              return (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <motion.div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      className={`group p-4 rounded-xl border transition-all duration-300 hover:shadow-card cursor-pointer ${
                                        snapshot.isDragging ? 'shadow-xl rotate-3 scale-105' : ''
                                      } ${
                                        task.status === 'done'
                                          ? 'bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 opacity-75'
                                          : isOverdue
                                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                          : isDueToday
                                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                          : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
                                      }`}
                                    >
                                      <div className="flex items-start space-x-3">
                                        <motion.button
                                          onClick={() => toggleTaskStatus(task.id)}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                            task.status === 'done'
                                              ? 'bg-green-500 border-green-500'
                                              : task.status === 'inprogress'
                                              ? 'bg-blue-500 border-blue-500'
                                              : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'
                                          }`}
                                        >
                                          {task.status === 'done' && (
                                            <ApperIcon name="Check" className="w-3 h-3 text-white" />
                                          )}
                                          {task.status === 'inprogress' && (
                                            <ApperIcon name="Clock" className="w-3 h-3 text-white" />
                                          )}
                                        </motion.button>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <h3 className={`font-semibold text-sm ${
                                              task.status === 'done' 
                                                ? 'line-through text-surface-500 dark:text-surface-400' 
                                                : 'text-surface-900 dark:text-surface-100'
                                            }`}>
                                              {task.title}
                                            </h3>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                                              {priority.label}
                                            </div>
                                          </div>

                                          {task.description && (
                                            <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">
                                              {task.description}
                                            </p>
                                          )}

                                          <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <div className="flex items-center space-x-1">
                                              <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                                              <span className="text-surface-600 dark:text-surface-400">{category.name}</span>
                                            </div>
                                            
                                            {task.dueDate && (
                                              <div className={`flex items-center space-x-1 ${
                                                isOverdue ? 'text-red-600 dark:text-red-400' :
                                                isDueToday ? 'text-yellow-600 dark:text-yellow-400' :
                                                'text-surface-600 dark:text-surface-400'
                                              }`}>
                                                <ApperIcon name="Calendar" className="w-3 h-3" />
                                                <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          <motion.button
                                            onClick={() => handleEdit(task)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                                          >
                                            <ApperIcon name="Edit" className="w-3 h-3" />
                                          </motion.button>
                                          <motion.button
                                            onClick={() => handleDelete(task.id)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 text-surface-600 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                                          >
                                            <ApperIcon name="Trash2" className="w-3 h-3" />
                                          </motion.button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </Draggable>
                              )
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )
                })}
              </div>
            </DragDropContext>
          ) : (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6' : 'space-y-3 md:space-y-4'}`}>
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => {
                  const category = categories.find(cat => cat.id === task.category)
                  const priority = priorities.find(p => p.value === task.priority)
                  const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'done'
                  const isDueToday = isToday(new Date(task.dueDate))

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`group p-4 md:p-6 rounded-2xl border transition-all duration-300 hover:shadow-card ${
                        task.status === 'done'
                          ? 'bg-surface-50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-600 opacity-75'
                          : isOverdue
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : isDueToday
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                          : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <motion.button
                          onClick={() => toggleTaskStatus(task.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            task.status === 'done'
                              ? 'bg-green-500 border-green-500'
                              : task.status === 'inprogress'
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'
                          }`}
                        >
                          {task.status === 'done' && (
                            <ApperIcon name="Check" className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          )}
                          {task.status === 'inprogress' && (
                            <ApperIcon name="Clock" className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          )}
                        </motion.button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className={`font-semibold text-sm md:text-base ${
                              task.status === 'done' 
                                ? 'line-through text-surface-500 dark:text-surface-400' 
                                : 'text-surface-900 dark:text-surface-100'
                            }`}>
                              {task.title}
                            </h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                              {priority.label}
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                              <span className="text-surface-600 dark:text-surface-400">{category.name}</span>
                            </div>
                            
                            {task.dueDate && (
                              <div className={`flex items-center space-x-1 ${
                                isOverdue ? 'text-red-600 dark:text-red-400' :
                                isDueToday ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-surface-600 dark:text-surface-400'
                              }`}>
                                <ApperIcon name="Calendar" className="w-3 h-3 md:w-4 md:h-4" />
                                <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            onClick={() => handleEdit(task)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 md:p-2 text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                          >
                            <ApperIcon name="Edit" className="w-3 h-3 md:w-4 md:h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(task.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 md:p-2 text-surface-600 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                          >
                            <ApperIcon name="Trash2" className="w-3 h-3 md:w-4 md:h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}


          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8 md:py-12"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-surface-100 dark:bg-surface-700 rounded-2xl flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-8 h-8 md:w-10 md:h-10 text-surface-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                {searchTerm || filter !== 'all' ? 'No matching tasks' : 'No tasks yet'}
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first task to get started with TaskFlow'
                }
              </p>
              {!searchTerm && filter === 'all' && (
                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-glow hover:shadow-xl transition-all duration-200"
                >
                  <ApperIcon name="Plus" className="w-5 h-5" />
                  <span>Add Your First Task</span>
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default MainFeature