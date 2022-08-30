Rails.application.routes.draw do
  resources :links
  resources :comments
  resources :votes
  resources :playlists
  resources :songs
  resources :users
  resources :votes
  resources :links
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  post '/login', to: 'sessions#create'
  get "/me", to: "users#show"
  delete "/logout", to: "sessions#destroy"
  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }

  get '/artists', to: 'users#index'

  get '/artist/:url', to: 'users#display'

  get '/contest', to: 'playlists#contest'

  get '/current', to: 'playlists#current'

  get '/previous', to: 'playlists#previous'

  get '/submission', to: 'songs#submission'

  get '/discography/:id', to: 'users#discography'

  get '/currentvote', to: 'votes#currentvote'

  get '/currentcomment', to: 'comments#currentcomment'

  get '/winner', to: 'playlists#winner'

end
